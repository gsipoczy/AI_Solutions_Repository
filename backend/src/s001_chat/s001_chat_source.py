from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from werkzeug.utils import secure_filename
from app import app
from tempfile import NamedTemporaryFile
import os
from . s001_rag_util import RagUtil
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
#from app import app
#from app.ollama import Ollama
from app import appConstants, ollama_main

class Conversation():

    conversation = []
    messages = []
    counter = 0

    def __init__(self):
        self.conversation = []
        self.counter = 0

    def get_conversation(self):
        return self.conversation
    
    def set_conversation(self, conversation):
        self.conversation = conversation

    def get_messages(self):
        return self.messages
    
    def set_messages(self, messages):
        self.messages = messages

    def clear_conversation(self):
        self.conversation = []
        self.counter = 0

    def clear_messages(self):
        self.messages = []

    def add_entry(self, entry):
        self.counter = self.counter + 1
        entry['counter'] = self.counter
        self.conversation.insert(0, entry)

    def add_message(self, message):
        self.messages = self.messages + message


class MainClass():
    OPENAI_API_KEY = ""
    OPENAI_MODEL = "" 
    conversation = None
    counter = 0
    model = None
    local_model = None
    workflow = None
    workflow_local = None
    memory = None
    appp = None
    appp_local = None
    config = None
    #messages = []
    username = None
    util = None
    purpose = ""
    use_local = False

    def __init__(self, username, gpt_api_key, gpt_model, purpose, conversation, use_local):
        self.OPENAI_API_KEY = gpt_api_key
        self.OPENAI_MODEL = gpt_model
        self.conversation = conversation
        self.counter = 0
        self.model = ChatOpenAI(openai_api_key=self.OPENAI_API_KEY, model_name=self.OPENAI_MODEL, temperature=0.3)
        #ollama = Ollama()
        #self.local_model = ollama.get_model()
        self.local_model = ollama_main.get_model()
        self.username = username
        self.util = RagUtil(gpt_api_key, use_local)
        self.purpose = purpose
        self.use_local = use_local
        self.prepare()

    def process_files(self, files):

        for file in files:

            docs, file_list = self.util.get_docs_from_file(file)
            if docs:
                self.util.add_docs_to_vecstore(docs, 1000, 200)

        return file_list

    def get_ai_answer(self, query):
        if self.purpose == appConstants.D001_CHAT:
            self.conversation.add_message([HumanMessage(query)])
            if not self.use_local:
                output = self.appp.invoke({"messages": self.conversation.get_messages()}, self.config)
            else:
                output = self.appp_local.invoke({"messages": self.conversation.get_messages()}, self.config)

            ans = output["messages"][-1].content
            self.conversation.add_message([AIMessage(ans)])
        else:        
            vsr = self.util.get_vsr()
            retriever = vsr[0].as_retriever()
            
            if not self.use_local:
                llm = self.model
            else:
                llm = self.local_model

            system_prompt = (
                "You are an assistant for question-answering tasks. "
                "Use the following pieces of retrieved context to answer "
                "the question. If you don't know the answer, say that you "
                "don't know. Use three sentences maximum and keep the "
                "answer concise."
                "\n\n"
                "{context}"
            )

            prompt = ChatPromptTemplate.from_messages(
                [
                    ("system", system_prompt),
                    ("human", "{input}"),
                ]
            )

            question_answer_chain = create_stuff_documents_chain(llm, prompt)
            rag_chain = create_retrieval_chain(retriever, question_answer_chain)

            results = rag_chain.invoke({"input": query})

            anslength = len(results["context"])
            if anslength > 0:
                ans = results["answer"] + "\n\n" + str(results["context"][0].metadata)
                self.conversation.add_message([AIMessage(ans)])
            else:
                ans = "No answer received."

        return ans

    # Define the function that calls the model
    def call_model(self, state: MessagesState):
        response = self.model.invoke(state["messages"])
        return {"messages": response}
    def call_model_local(self, state: MessagesState):
        response = self.local_model.invoke(state["messages"])
        return {"messages": response}
        
    def prepare(self):
        # Define a new graph
        self.workflow = StateGraph(state_schema=MessagesState)
        self.workflow_local = StateGraph(state_schema=MessagesState)

        # Define the (single) node in the graph
        self.workflow.add_edge(START, "model")
        self.workflow.add_node("model", self.call_model)
        self.workflow_local.add_edge(START, "model")
        self.workflow_local.add_node("model", self.call_model_local)

        # Add memory
        self.memory = MemorySaver()
        self.appp = self.workflow.compile(checkpointer=self.memory)
        self.appp_local = self.workflow_local.compile(checkpointer=self.memory)

        self.config = {"configurable": {"thread_id": "abc123"}}
    
    def get_answer(self, query):
        answer = self.get_ai_answer(query)
        entry = {
            "counter": 0,
            "query": query,
            "answer": answer
        }
        self.conversation.add_entry(entry)
        return answer
    
    def get_openai_api_key(self):
        return self.OPENAI_API_KEY
    
    def get_openai_model(self):
        return self.OPENAI_MODEL

    def set_openai_api_key(self, key):
        self.OPENAI_API_KEY = key

    def set_openai_model(self, model):
        self.OPENAI_MODEL = model

    def clear_conversation(self):
        self.conversation.clear_conversation()
        self.conversation.clear_messages()
        self.counter = 0

    #def clear_messages(self):
        #self.messages = []
