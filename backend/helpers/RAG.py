import openai, os
import numpy as np
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from concurrent.futures import ThreadPoolExecutor, as_completed
import sqlite3

class RAG:
    def __init__(self, embedding_model = 'text-embedding-ada-002'):
        self.gpt_key = os.getenv('GPT_KEY')
        self.embedding_model = embedding_model

    def _embed_description(self, description):
        '''
        Embed a description using the OpenAIEmbeddings model.

        Parameters
        ----------
        description : str
            description to be embedded.

        Returns
        -------
        numpy.ndarray
            An array of embeddings, where each embedding corresponds to a description in the input list.
        '''

        embeddings_model = OpenAIEmbeddings(openai_api_key=self.gpt_key)  
        return embeddings_model.embed_query(description)
    
    def _cosine_similarity(self, vec1, vec2):
        '''
        finding similarity between vectors
        '''
        return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

    def _find_most_similar_chunks(self, query, chunks, k=10):
        '''
        Find the most similar text chunks to a query based on cosine similarity.

        Parameters
        ----------
        query : str
            The query text for which similar chunks are to be found.
        chunks : list of str
            A list of text chunks to compare against the query.
        k : int, optional
            The number of most similar chunks to return (default is 10).

        Returns
        -------
        list of str
            A list of the most similar text chunks to the query.
        '''
        # Embed the query and chunks
        query_embedding = self._embed_texts([query])[0]
        chunk_embeddings = self._embed_texts(chunks)

        # Store chunks and their embeddings in the database
        # for chunk, embedding in zip(chunks, chunk_embeddings):
        #     insert_sentence(chunk)
        #     insert_embedding(embedding)

        # Calculate similarities
        similarities = self._calculate_cosine_similarity(query_embedding, chunk_embeddings)

        # Get the top-k most similar chunks
        top_k_indices = similarities.argsort()[-k:][::-1]
        most_similar_chunks = [chunks[i] for i in top_k_indices]
        return most_similar_chunks
    