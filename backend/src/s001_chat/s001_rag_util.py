import os
from app import app
from tempfile import NamedTemporaryFile
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
#from app.ollama import Ollama
from app import ollama_embedding

class RagUtil():

    def __init__(self, gpt_api_key, use_local):
        self.gpt_api_key = gpt_api_key
        self.use_local = use_local
        if not use_local:
            self.embedding = OpenAIEmbeddings(openai_api_key=gpt_api_key)
        else:
            #ollama = Ollama()
            #self.embedding = ollama.get_embedding()
            self.embedding = ollama_embedding
        self.vectorstore = InMemoryVectorStore(embedding=self.embedding)
        self.retriever = self.vectorstore.as_retriever()
        self.vsr = [self.vectorstore, self.retriever]
        self.file_list = []

    def get_docs_from_file(self, file):

        app.logger.info('Start file vectorizing')

        if file and file.filename != '': 
            app.logger.debug("Original filename: " + file.filename)

            # Check if it was uploaded already
            if file.filename in self.file_list:
                return None, self.file_list
            else:
                self.file_list.append(file.filename)
                split = os.path.splitext(file.filename)
                fname = split[0]
                fext = split[1]
                app.logger.debug(" (" + fname + "|" + fext + ")\n")
                with NamedTemporaryFile(suffix=fext, prefix=fname) as temp:
                    file.save(temp)
                    temp.seek(0)
                    app.logger.debug("Temporary filename: " + temp.name + "\n")
                    loader = None
                    match fext:
                        case ".pdf":
                            loader = PyPDFLoader(temp.name)
                        case ".txt":
                            loader = TextLoader(temp.name)
                        case _:
                            app.logger.warning("Document type " + split[1] + " is unknown\n")
                    if loader:
                        docs = loader.load()
                        app.logger.info('File vectorizing completed')
                        return docs, self.file_list
        app.logger.warning('File was empty')
        return None, self.file_list
    
    def add_docs_to_vecstore(self, docs, size, overlap):

        vst = self.vsr[0]
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=size, chunk_overlap=overlap)
        splits = text_splitter.split_documents(docs)
        app.logger.debug("Adding " + str(len(splits)) + " chunks to the vector database.\n")
        vst.add_documents(documents=splits)
        app.logger.info("Data vectorization done.\n")
    
    def get_vsr(self):
        return self.vsr
        
    def clear_vectorstore(self):
        print("CLEARING VECTORSTORE")
        self.vectorstore = InMemoryVectorStore(embedding=self.embedding)
        self.retriever = self.vectorstore.as_retriever()
        self.vsr = [self.vectorstore, self.retriever]
        self.file_list = []
