from transformers import BartForConditionalGeneration, BartTokenizer

class SentenceSimplifier:
    def __init__(self, model_name="eilamc14/bart-base-text-simplification"):
        self.model = BartForConditionalGeneration.from_pretrained(model_name)
        self.tokenizer = BartTokenizer.from_pretrained(model_name)

    def simplify(
        self,
        sentence: str,
        max_new_tokens: int = 64,
        num_beams: int = 4,
        no_repeat_ngram_size: int = 3,
    ) -> str:
        prompt = f"Simplify: {sentence}"
        inputs = self.tokenizer(prompt, return_tensors="pt", max_length=512, truncation=True)
        outputs = self.model.generate(
            **inputs,
            max_new_tokens=max_new_tokens,
            num_beams=num_beams,
            no_repeat_ngram_size=no_repeat_ngram_size,
            do_sample=False,
        )
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True).strip()


def main(text):
    simplifier = SentenceSimplifier()

    simplified = simplifier.simplify(text)

    return simplified

