class contextmanager:
    def __init__(self, max_messages=10):
        self.history = []
        self.max_messages = max_messages
    
    def add_message(self, role, content):
        content = content.strip()
        content = content[:1000]

        if len(self.history) > 0 and self.history[-1]["content"] == content:
            return
        
        self.history.append({"role": role, "content": content})
        if len(self.history) > self.max_messages:
            self.history = self.history[-self.max_messages:]
            
    def build_context(self):
        context_str = ""
        for message in self.history:
            context_str += f"{message['role']}: {message['content']}\n"
        return context_str