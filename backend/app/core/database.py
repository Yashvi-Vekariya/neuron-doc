import os
from supabase import create_client, Client
from app.core.config import settings

class Database:
    def __init__(self):
        self.url = settings.SUPABASE_URL
        self.key = settings.SUPABASE_KEY
        self.client: Client = None
        
    def connect(self):
        if not self.url or not self.key:
            raise ValueError("Supabase URL and Key are required")
        self.client = create_client(self.url, self.key)
        return self.client
    
    def get_client(self):
        if not self.client:
            self.connect()
        return self.client

db = Database()