from neo4j import GraphDatabase
import os
import networkx as nx

# For the hackathon, we use Neo4j if available, 
# otherwise we can fallback to NetworkX (in-memory graph) for immediate testing.
USE_NEO4J = os.getenv("USE_NEO4J", "False").lower() in ("true", "1", "yes")

class GraphDatabaseManager:
    def __init__(self):
        self.use_neo4j = USE_NEO4J
        if self.use_neo4j:
            # Default local Neo4j credentials (you can change these)
            uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
            user = os.getenv("NEO4J_USER", "neo4j")
            password = os.getenv("NEO4J_PASSWORD", "password")
            try:
                self.driver = GraphDatabase.driver(uri, auth=(user, password))
                print("Connected to Neo4j successfully!")
            except Exception as e:
                print(f"Failed to connect to Neo4j: {e}")
                self.driver = None
                self.use_neo4j = False
        
        if not self.use_neo4j:
            print("Using NetworkX (In-Memory Graph) as fallback.")
            self.graph = nx.Graph()

    def close(self):
        if self.use_neo4j and self.driver:
            self.driver.close()

    def create_entity(self, handle, pgp_key, wallet_address):
        if self.use_neo4j:
            with self.driver.session() as session:
                session.run(
                    "MERGE (a:Actor {handle: $handle}) "
                    "MERGE (p:PGPKey {key: $pgp_key}) "
                    "MERGE (w:Wallet {address: $wallet_address}) "
                    "MERGE (a)-[:USES_PGP]->(p) "
                    "MERGE (a)-[:OWNS_WALLET]->(w)",
                    handle=handle, pgp_key=pgp_key, wallet_address=wallet_address
                )
        else:
            self.graph.add_node(handle, type="Actor")
            self.graph.add_node(pgp_key, type="PGPKey")
            self.graph.add_node(wallet_address, type="Wallet")
            self.graph.add_edge(handle, pgp_key, relation="USES_PGP")
            self.graph.add_edge(handle, wallet_address, relation="OWNS_WALLET")

    def link_actors_by_style(self, handle1, handle2, confidence):
        if self.use_neo4j:
            with self.driver.session() as session:
                session.run(
                    "MATCH (a1:Actor {handle: $handle1}) "
                    "MATCH (a2:Actor {handle: $handle2}) "
                    "MERGE (a1)-[r:STYLE_MATCH {confidence: $confidence}]->(a2)",
                    handle1=handle1, handle2=handle2, confidence=confidence
                )
        else:
            if handle1 in self.graph.nodes and handle2 in self.graph.nodes:
                self.graph.add_edge(handle1, handle2, relation="STYLE_MATCH", confidence=confidence)

    def get_graph_data(self):
        # A simple export function to send data to the Next.js Frontend
        if self.use_neo4j:
            # Cypher query to get nodes and edges
            pass # (Implementation left for full Neo4j setup)
            return {"nodes": [], "edges": []}
        else:
            nodes = [{"id": n, "label": self.graph.nodes[n].get("type", "Unknown")} for n in self.graph.nodes]
            edges = [{"source": u, "target": v, "label": self.graph[u][v].get("relation", "")} for u, v in self.graph.edges]
            return {"nodes": nodes, "edges": edges}

db_manager = GraphDatabaseManager()
