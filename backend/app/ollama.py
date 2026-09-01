from langchain_ollama import ChatOllama
from langchain_ollama import OllamaEmbeddings

class Ollama():
    ollama_model = None
    ollama_embedding = None

    def __init__(self):
        self.result = []
        self.messages = [
            (
                "system",
                "You are a helpful assistant that translates English to French. Translate the user sentence.",
            ),
            ("human", "I love programming."),
        ]
        try:
            self.result.append('OLLAMA init: try llama3, with base URL')
            self.ollama_model = ChatOllama(model="llama3", base_url="http://ollama:11434")
            answer = self.ollama_model.invoke(self.messages)
            self.ollama_embedding = OllamaEmbeddings(model="nomic-embed-text", base_url="http://ollama:11434")
            self.result.append('SUCCESS: OLLAMA init: try llama3, with base URL')
        except:
            try:
                self.result.append('OLLAMA init: try llama3 simply')
                self.ollama_model = ChatOllama(model="llama3")
                answer = self.ollama_model.invoke(self.messages)
                self.ollama_embedding = OllamaEmbeddings(model="nomic-embed-text")
                self.result.append('SUCCESS: OLLAMA init: try llama3 simply')
            except:
                try:
                    self.result.append('OLLAMA init: try llama3.1:8b')
                    self.ollama_model = ChatOllama(model="llama3.1:8b")
                    answer = self.ollama_model.invoke(self.messages)
                    self.ollama_embedding = OllamaEmbeddings(model="nomic-embed-text")
                    self.result.append('SUCCESS: OLLAMA init: try llama3.1:8b')
                except:
                    self.result.append('ERROR: Could not initialize Ollama model and embedding.')
                    self.ollama_model = None
                    self.ollama_embedding = None

    def get_model(self):
        return self.ollama_model
    def get_embedding(self):
        return self.ollama_embedding
    def get_result(self):
        return self.result