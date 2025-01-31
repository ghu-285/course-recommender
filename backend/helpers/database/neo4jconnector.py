from neo4j import GraphDatabase

class Neo4jConnector:
    def __init__(self, uri, user, password):
        """
        Initialize the Neo4j connector.
        """
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        """
        Close the Neo4j connection.
        """
        self.driver.close()

    def insert_course(self, course):
        """
        Insert a course and its major into Neo4j.
        Excludes the embedding field.
        """
        query = """
        MERGE (c:Course {code: $code})
        SET c.title = $title, c.description = $description
        MERGE (m:Major {name: $major})
        MERGE (m)-[:REQUIRES]->(c)
        """
        with self.driver.session() as session:
            session.run(query, 
                        code=course["code"], 
                        title=course["title"], 
                        description=course["description"], 
                        major=course["major"])
