import json
import os
import random
import shutil
import sqlite3
import uuid
from datetime import datetime, timedelta, timezone

def generate_mock_transactions(count=650):
    currencies = ["USD", "BIF"]
    statuses = ["COMPLETED", "PENDING", "FAILED"]
    status_weights = [0.74, 0.16, 0.10]
    channels = ["MOBILE_MONEY", "CARD", "BANK_TRANSFER"]
    channel_weights = [0.45, 0.35, 0.20]

    counterparties_bif = [
        "Aline Niyonzima (+257 79 432 109)",
        "Ecocash Agent #1042 (Bujumbura)",
        "Jean-Claude Hakizimana (+257 71 882 341)",
        "Lumicash Merchant BDI #409",
        "Diane Uwimana (+257 76 991 223)",
        "Thierry Nkurunziza (+257 79 105 882)",
        "Burundi Forex Clearing Desk",
        "Gasore Patrick (+257 75 332 990)",
        "Bujumbura Logistics Hub (+257 71 229 011)",
        "Inyange Trading Agency (+257 79 667 341)",
        "Ecocash Pay Point #78",
        "Bella Marie Kaneza (+257 72 445 119)",
        "Banque Commerciale du Burundi (BANCOBU)",
        "Interbank Burundi Transfer S.A.",
        "Finbank BDI Settlement Node",
        "Celestin Ndikumana (+257 79 881 902)",
        "Kanyosha Market Cooperative",
        "Ngozi Agricultural Exporters",
        "Gitega Central Mobile Pay",
        "Chantal Irakoze (+257 76 112 440)"
    ]

    counterparties_usd = [
        "Stripe Payments Europe Ltd",
        "Apex Horizon Capital (+1 415 882 9102)",
        "Elena Rostova (+1 646 901 3340)",
        "Standard Chartered Clearing NYC",
        "Mastercard Merchant Settlement",
        "Cloudflare CDN Invoicing",
        "KCB Bank East Africa FX",
        "Amazon Web Services Cloud",
        "Marcus Vance (+44 20 7946 0912)",
        "Sophia Chen (+65 8123 4567)",
        "Veloce Global Remittance",
        "Nordic Clearing Union S.A.",
        "David O'Connor (+353 1 496 0122)",
        "Cyberdyne FinTech Solutions",
        "Quantum Hedge Liquidity",
        "Pacific Gateway Logistics",
        "Mateo Silva (+55 11 98765 4321)",
        "PaySafe Global Merchant Services",
        "Astra Satellite Telecom",
        "Zephyr Cloud Infrastructure"
    ]

    # Distribute timestamps relative to current time so ledger reflects live activity
    base_time = datetime.now(timezone.utc)
    transactions = []

    for i in range(count):
        # Time distributed over the past 45 days
        minutes_back = random.randint(5, 45 * 24 * 60)
        seconds_back = random.randint(0, 59)
        tx_time = base_time - timedelta(minutes=minutes_back, seconds=seconds_back)
        
        currency = random.choices(currencies, weights=[0.48, 0.52])[0]
        status = random.choices(statuses, weights=status_weights)[0]
        channel = random.choices(channels, weights=channel_weights)[0]

        if currency == "USD":
            counterparty = random.choice(counterparties_usd)
            # amount in cents ($5.00 to $12,500.00)
            amount = random.randint(500, 1250000)
        else:
            counterparty = random.choice(counterparties_bif)
            # amount in BIF (5,000 BIF to 18,000,000 BIF)
            amount = random.randint(5000, 18000000)

        tx_id = f"tx_{uuid.uuid4().hex[:12]}"
        
        tx = {
            "id": tx_id,
            "date": tx_time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "amount": amount,
            "currency": currency,
            "status": status,
            "channel": channel,
            "counterparty": counterparty
        }
        transactions.append(tx)

    # Sort descending by date (most recent first)
    transactions.sort(key=lambda x: x["date"], reverse=True)
    return transactions

def save_to_sqlite(transactions, db_path=None):
    if db_path is None:
        db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "transactions.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS transactions")
    cursor.execute("""
        CREATE TABLE transactions (
            id TEXT PRIMARY KEY,
            date TEXT NOT NULL,
            amount INTEGER NOT NULL,
            currency TEXT NOT NULL,
            status TEXT NOT NULL,
            channel TEXT NOT NULL,
            counterparty TEXT NOT NULL
        )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_status ON transactions(status)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_channel ON transactions(channel)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_date ON transactions(date)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_currency ON transactions(currency)")

    records = [
        (t["id"], t["date"], t["amount"], t["currency"], t["status"], t["channel"], t["counterparty"])
        for t in transactions
    ]
    cursor.executemany("""
        INSERT INTO transactions (id, date, amount, currency, status, channel, counterparty)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, records)
    conn.commit()
    conn.close()
    print(f"Saved {len(transactions)} transactions to SQLite database {db_path}")

    # Also keep fintech.db and transactions.json in sync
    fintech_db = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fintech.db")
    if os.path.abspath(db_path) != os.path.abspath(fintech_db):
        shutil.copy2(db_path, fintech_db)

    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "transactions.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(transactions, f, indent=2)

if __name__ == "__main__":
    txs = generate_mock_transactions(650)
    save_to_sqlite(txs)
