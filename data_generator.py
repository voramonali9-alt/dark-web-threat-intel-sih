import json
import random
import uuid
from faker import Faker

fake = Faker()

def generate_mock_data():
    # Threat Actor 1: The "Russian Scripter" - uses short sentences, specific misspellings ("teh", "plz"), mentions malware.
    actor_1_style = [
        "selling teh new rootkit. plz DM me for details.",
        "who has access to the new database? need it fast. plz.",
        "teh exploit is working on windows 11. very good.",
        "buying zero days. DM plz.",
        "this is teh best tool for persistence."
    ]
    
    # Threat Actor 2: The "Professional Broker" - polite, uses good grammar, discusses crypto, uses 'regards'.
    actor_2_style = [
        "I am looking to purchase bulk access to financial institutions. Escrow only.",
        "The recent database leak contains high-quality credentials. Regards.",
        "We are offering a new Ransomware-as-a-Service model. Serious inquiries only. Regards.",
        "Please provide the PGP key for secure communication. I do not use Jabber.",
        "Transaction complete. I recommend this vendor for future business. Regards."
    ]

    # Threat Actor 3: The "Chaotic Script Kiddie" - ALL CAPS, lots of punctuation, aggressive.
    actor_3_style = [
        "GIVE ME THE ADMIN PANEL PASSWORD NOW!!!",
        "THIS LEAK IS TRASH!!! DO NOT BUY FROM HIM!!",
        "HOW DO I SETUP A BOTNET??? PLZ HELP ASAP!!!",
        "I JUST DDOS'D THE GOVERNMENT SITE HAHAHA!!!",
        "ANYONE SELLING CHEAP PROXIES???"
    ]

    styles = [actor_1_style, actor_2_style, actor_3_style]
    
    mock_data = {
        "forum_posts": [],
        "entities": []
    }

    # Generate handles and entities
    actor_handles = {}
    for i, style in enumerate(styles):
        actor_id = f"ACTOR_00{i+1}"
        handles = [fake.user_name(), fake.user_name()] # 2 aliases per actor
        actor_handles[i] = handles
        
        for handle in handles:
            mock_data["entities"].append({
                "handle": handle,
                "pgp_key": f"-----BEGIN PGP PUBLIC KEY BLOCK-----\n...\n{uuid.uuid4().hex}\n-----END PGP PUBLIC KEY BLOCK-----",
                "wallet_address": f"bc1q{uuid.uuid4().hex[:12]}",
                "true_actor_id": actor_id # We know this, the AI has to figure it out
            })

    # Generate posts
    for _ in range(50):
        # Pick a random actor (0, 1, or 2)
        actor_idx = random.randint(0, 2)
        # Pick one of their handles
        handle = random.choice(actor_handles[actor_idx])
        # Pick a post from their style
        content = random.choice(styles[actor_idx])
        
        # Add random variation so posts aren't exactly identical
        variation = f" {fake.hexify(text='^^^', upper=False)}"
        
        post = {
            "post_id": str(uuid.uuid4()),
            "author_handle": handle,
            "content": content + variation,
            "timestamp": fake.iso8601(),
            "forum": random.choice(["Dread", "RaidForums", "BreachForums"])
        }
        mock_data["forum_posts"].append(post)

    with open("darkweb_mock_data.json", "w") as f:
        json.dump(mock_data, f, indent=4)
        
    print("Mock data generated successfully in 'darkweb_mock_data.json'")

if __name__ == "__main__":
    generate_mock_data()
