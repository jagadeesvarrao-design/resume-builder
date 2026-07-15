import json

# Exchange rate: 1 USD = 83.5 INR
USD_TO_INR = 83.5

# Ads seen per session is now EXACTLY 10 as requested
ADS_PER_SESSION = 10.0

# Blended CPM (Cost per 1,000 impressions)
# Career/Resume niche blended traffic (90% India at $1.50 CPM, 10% USA/Europe at $15.00 CPM)
BLENDED_CPM = 2.85 

def calculate_scenario(monthly_visitors):
    monthly_impressions = monthly_visitors * ADS_PER_SESSION
    monthly_earnings_usd = (monthly_impressions / 1000.0) * BLENDED_CPM
    monthly_earnings_inr = monthly_earnings_usd * USD_TO_INR
    
    annual_earnings_usd = monthly_earnings_usd * 12
    annual_earnings_inr = monthly_earnings_inr * 12
    
    return {
        "monthly_visitors": monthly_visitors,
        "monthly_impressions": int(monthly_impressions),
        "monthly_usd": monthly_earnings_usd,
        "monthly_inr": monthly_earnings_inr,
        "annual_usd": annual_earnings_usd,
        "annual_inr": annual_earnings_inr
    }

# Simulation 1: Grand Success (100,000 visitors/month)
s1 = calculate_scenario(100000)

# Simulation 2: Moderate Success (20,000 visitors/month)
s2 = calculate_scenario(20000)

# Simulation 3: Not Success (2,000 visitors/month)
s3 = calculate_scenario(2000)

results = {
    "Grand Success (S1)": s1,
    "Moderate Success (S2)": s2,
    "Not Success (S3)": s3
}

print(json.dumps(results, indent=2))
