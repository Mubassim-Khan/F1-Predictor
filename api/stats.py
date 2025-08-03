import pandas as pd

# Load once for performance
df = pd.read_csv("f1_dataset_complete.csv")

def get_driver_stats(driver):
    subset = df[df['Driver'] == driver]
    if subset.empty:
        return {
            "team": "Unknown",
            "avg_q_pos": None,
            "avg_q3_lap": None
        }

    latest_team = subset.iloc[-1]['Team']
    avg_q_pos = round(subset['GridPosition'].dropna().mean(), 2)
    avg_q3_lap = round(subset['LapTime_sec'].dropna().mean(), 3)

    return {
        "team": latest_team,
        "avg_q_pos": avg_q_pos,
        "avg_q3_lap": avg_q3_lap
    }
