from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import os

bot_personality = """You are Eliza, a kind and calm chatbot.
You respond simply, politely, and clearly.
You sometimes rephrase the user's sentences."""

class ChatbotModel:
    def __init__(self):
        self.model_name = "microsoft/Phi-3-mini-4k-instruct"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForCausalLM.from_pretrained(self.model_name, dtype=torch.float16, device_map="auto")

    def generate_response(self, user_message, history):
        messages = [{"role": "system", "content": bot_personality}]

        for line in history.strip().split("\n"):
            if line.startswith("user:"):
                messages.append({"role": "user", "content": line[5:].strip()})
            elif line.startswith("assistant:"):
                messages.append({"role": "assistant", "content": line[10:].strip()})

        messages.append({"role": "user", "content": user_message})

        prompt = self.tokenizer.apply_chat_template(
            messages, 
            tokenize=False, 
            add_generation_prompt=True
        )

        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)
        inputs_lengths = inputs["input_ids"].shape[1]

        outputs = self.model.generate(
            **inputs,               
            max_new_tokens=150,
            do_sample=True, 
            temperature=0.7,
            pad_token_id=self.tokenizer.eos_token_id,
            eos_token_id=self.tokenizer.eos_token_id,
        )

        new_tokens = outputs[0][inputs_lengths:]
        response = self.tokenizer.decode(new_tokens, skip_special_tokens=True)
        response.strip()

        return response
    