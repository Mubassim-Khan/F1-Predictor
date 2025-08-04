import joblib
import pandas as pd
from fastf1 import get_session
from flask import jsonify

model = joblib.load('api/model/f1_position_predictor.pkl')

features = [
    'Driver', 'Team', 'Compound', 'TyreLife', 'FreshTyre', 'Stint', 'TrackStatus',
    'Deleted', 'Sector1Time_sec', 'Sector2Time_sec', 'Sector3Time_sec', 'LapTime_sec', 'GridPosition'
]

def format_laptime(seconds):
    if pd.isna(seconds):
        return None
    minutes = int(seconds // 60)
    secs = seconds % 60
    return f"{minutes}:{secs:05.2f}"

def predict_race_positions(data):
    try:
        year = data.get("year")
        gp = data.get("gp")

        session = get_session(year, gp, 'Q')
        session.load()

        # Check if session has data
        if session.laps.empty:
            return {"error": f"No qualifying data available yet for {gp} {year}."}

        laps = session.laps.pick_quicklaps()

        best_laps = laps.sort_values("LapTime").groupby("Driver", as_index=False).first()

        best_laps = best_laps[['Driver', 'Team', 'LapTime', 'Compound', 'TyreLife', 'FreshTyre',
                               'Stint', 'TrackStatus', 'Deleted', 'Sector1Time', 'Sector2Time',
                               'Sector3Time', 'LapNumber', 'DriverNumber']].copy()

        best_laps['LapTime_sec'] = best_laps['LapTime'].dt.total_seconds()
        best_laps['Sector1Time_sec'] = best_laps['Sector1Time'].dt.total_seconds()
        best_laps['Sector2Time_sec'] = best_laps['Sector2Time'].dt.total_seconds()
        best_laps['Sector3Time_sec'] = best_laps['Sector3Time'].dt.total_seconds()
        best_laps['GridPosition'] = best_laps['DriverNumber']

        X = best_laps[features]
        predictions = model.predict(X)

        best_laps['RawPrediction'] = predictions
        best_laps = best_laps.sort_values('RawPrediction')
        best_laps['PredictedPosition'] = range(1, len(best_laps) + 1)

        output = []
        for _, row in best_laps.iterrows():
            output.append({
                "Driver": row["Driver"],
                "Team": row["Team"],
                "PredictedPosition": int(row["PredictedPosition"]),
                "PredictedLapTime": format_laptime(row["LapTime_sec"])  # Converted lap time
            })

        return output

    except Exception as e:
        return {"error": str(e)}
