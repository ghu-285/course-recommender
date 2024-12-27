import openai, os
import numpy as np
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor, as_completed
import sqlite3

class RAG:
    def __init__(self, embedding_model = 'text-embedding-ada-002'):
        self.gpt_key = os.getenv('OPENAI_API_KEY')
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

    def _find_most_similar_courses(self, query, course_list, embedding_list, k=10):
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
        query_embedding = self._embed_description(query)

        # Store chunks and their embeddings in the database
        # for chunk, embedding in zip(chunks, chunk_embeddings):
        #     insert_sentence(chunk)
        #     insert_embedding(embedding)

        # Calculate similarities
        similarities = self._calculate_cosine_similarity(query_embedding, embedding_list)

        # Get the top-k most similar chunks
        top_k_indices = similarities.argsort()[-k:][::-1]
        most_similar_chunks = [course_list[i] for i in top_k_indices]
        return most_similar_chunks

    def _calculate_cosine_similarity(self, embedding, embeddings):
        '''
        Calculates the cosine similarity between a given embedding and a set of embeddings.

        Parameters
        ----------
        embedding : numpy.ndarray
            A 1D array representing the main embedding vector for which the cosine similarity is to be calculated.
        embeddings : numpy.ndarray
            A 2D array where each row represents the list of embedding vectors to be calculated with the main embedding.

        Returns
        -------
        numpy.ndarray
            A 1D array containing the cosine similarity scores between the input embedding and each of the embeddings in the 2D array.
        '''
        dot_product = np.dot(embeddings, embedding)
        norm_embedding = np.linalg.norm(embedding)
        norms_embeddings = np.linalg.norm(embeddings, axis=1)
        similarities = dot_product / (norms_embeddings * norm_embedding)
        return similarities
    