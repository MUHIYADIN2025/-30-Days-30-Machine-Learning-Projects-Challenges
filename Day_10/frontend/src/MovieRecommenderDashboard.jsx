import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

// ============================================================
// DESIGN TOKENS
// Cinematic marquee theme — grounded in the film-reel subject
// of a movie recommender. Deep charcoal + marquee gold + teal.
// ============================================================
const COLORS = {
  bg: "#14110F",
  bgPanel: "#1C1815",
  bgCard: "#211C18",
  gold: "#D4A24C",
  goldDim: "#8A6F3D",
  teal: "#2B7A78",
  tealBright: "#3FA7A4",
  text: "#F2EDE4",
  textMuted: "#9C948A",
  border: "#332C25",
};

const DISPLAY_FONT = "'Georgia', 'Times New Roman', serif";
const BODY_FONT = "'Helvetica Neue', Arial, sans-serif";
const MONO_FONT = "'Courier New', monospace";

// ============================================================
// MOCK DATA — stands in for the trained model's live output.
// In production this comes from predicted_ratings_df.
// ============================================================
const USERS = [
  { id: 1, name: "User 001", ticket: "A-014" },
  { id: 2, name: "User 002", ticket: "A-092" },
  { id: 3, name: "User 003", ticket: "B-041" },
];

const RECOMMENDATIONS_BY_USER = {
  1: [
    { title: "The Shawshank Redemption", genre: "Drama", predicted: 4.8 },
    { title: "Spirited Away", genre: "Animation", predicted: 4.7 },
    { title: "Whiplash", genre: "Drama", predicted: 4.6 },
    { title: "The Grand Budapest Hotel", genre: "Comedy", predicted: 4.5 },
    { title: "Arrival", genre: "Sci-Fi", predicted: 4.4 },
    { title: "Parasite", genre: "Thriller", predicted: 4.4 },
  ],
  2: [
    { title: "Mad Max: Fury Road", genre: "Action", predicted: 4.6 },
    { title: "Inception", genre: "Sci-Fi", predicted: 4.5 },
    { title: "The Dark Knight", genre: "Action", predicted: 4.5 },
    { title: "Interstellar", genre: "Sci-Fi", predicted: 4.3 },
    { title: "Gladiator", genre: "Action", predicted: 4.2 },
    { title: "No Country for Old Men", genre: "Thriller", predicted: 4.1 },
  ],
  3: [
    { title: "La La Land", genre: "Musical", predicted: 4.7 },
    { title: "Amelie", genre: "Romance", predicted: 4.6 },
    { title: "Little Miss Sunshine", genre: "Comedy", predicted: 4.4 },
    { title: "Lost in Translation", genre: "Drama", predicted: 4.3 },
    { title: "Eternal Sunshine", genre: "Romance", predicted: 4.3 },
    { title: "Her", genre: "Romance", predicted: 4.2 },
  ],
};

const RATING_DISTRIBUTION = [
  { rating: "1", count: 620 },
  { rating: "2", count: 1180 },
  { rating: "3", count: 2840 },
  { rating: "4", count: 3510 },
  { rating: "5", count: 1750 },
];

const METRICS = [
  { label: "RMSE", value: "0.874", note: "mean-centered CF" },
  { label: "MSE", value: "0.764", note: "held-out ratings" },
  { label: "USERS", value: "610", note: "unique raters" },
  { label: "MOVIES", value: "9,742", note: "catalog size" },
];

function Stars({ value }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span style={{ color: COLORS.gold, fontSize: 13, letterSpacing: 1 }}>
      {"\u2605".repeat(full)}
      {half ? "\u00BD" : ""}
      <span style={{ color: COLORS.border }}>
        {"\u2605".repeat(5 - full - (half ? 1 : 0))}
      </span>
    </span>
  );
}

function Sprockets() {
  const holes = new Array(22).fill(0);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "0 6px" }}>
      {holes.map((_, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: 2,
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
          }}
        />
      ))}
    </div>
  );
}

export default function MovieRecommenderDashboard() {
  const [userId, setUserId] = useState(1);
  const recs = useMemo(() => RECOMMENDATIONS_BY_USER[userId], [userId]);
  const topPick = recs[0];
  const activeUser = USERS.find((u) => u.id === userId);

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: BODY_FONT, color: COLORS.text }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 28px 72px" }}>

        {/* ---------------- HEADER ---------------- */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, color: COLORS.gold, fontWeight: 700, marginBottom: 8 }}>
              ITEM-BASED COLLABORATIVE FILTERING
            </div>
            <h1 style={{ fontFamily: DISPLAY_FONT, fontSize: 38, fontWeight: 700, margin: 0, letterSpacing: 0.5 }}>
              Now Screening: Your Recommendations
            </h1>
          </div>
          <div style={{ fontFamily: MONO_FONT, fontSize: 11, color: COLORS.textMuted, textAlign: "right" }}>
            DAY 10 · 30-DAY ML CHALLENGE<br />MODEL: COSINE SIMILARITY, MEAN-CENTERED
          </div>
        </div>

        <div style={{ height: 1, background: COLORS.border, margin: "20px 0 32px" }} />

        {/* ---------------- TICKET STUB: USER SELECTOR ---------------- */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, letterSpacing: 2, color: COLORS.textMuted, fontWeight: 700 }}>
            VIEWING AS
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            {USERS.map((u) => (
              <button
                key={u.id}
                onClick={() => setUserId(u.id)}
                style={{
                  position: "relative",
                  padding: "8px 18px 8px 14px",
                  background: userId === u.id ? COLORS.gold : COLORS.bgCard,
                  color: userId === u.id ? COLORS.bg : COLORS.text,
                  border: `1px dashed ${userId === u.id ? COLORS.gold : COLORS.border}`,
                  borderRadius: 4,
                  fontFamily: MONO_FONT,
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: 0.5,
                }}
              >
                {u.name} · #{u.ticket}
              </button>
            ))}
          </div>
        </div>

        {/* ---------------- HERO: TOP PICK ---------------- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "180px 1fr",
            gap: 28,
            background: COLORS.bgPanel,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            padding: 28,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: 8,
              background: `linear-gradient(155deg, ${COLORS.teal}, ${COLORS.bgCard})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: DISPLAY_FONT,
              fontSize: 44,
              fontWeight: 700,
              color: COLORS.gold,
            }}
          >
            {topPick.title.charAt(0)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: COLORS.tealBright, fontWeight: 700, marginBottom: 8 }}>
              TOP PICK FOR {activeUser.name.toUpperCase()}
            </div>
            <div style={{ fontFamily: DISPLAY_FONT, fontSize: 30, fontWeight: 700, marginBottom: 10 }}>
              {topPick.title}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Stars value={topPick.predicted} />
              <span style={{ fontFamily: MONO_FONT, fontSize: 15, color: COLORS.gold, fontWeight: 700 }}>
                {topPick.predicted.toFixed(1)} / 5.0
              </span>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  color: COLORS.textMuted,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 20,
                  padding: "3px 10px",
                }}
              >
                {topPick.genre.toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize: 12.5, color: COLORS.textMuted, marginTop: 14, maxWidth: 560, lineHeight: 1.5 }}>
              Predicted from movies most similar in rating pattern to titles {activeUser.name} has already rated highly — not from genre metadata alone.
            </div>
          </div>
        </div>

        {/* ---------------- METRICS PLAQUES ---------------- */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 40 }}>
          {METRICS.map((m) => (
            <div
              key={m.label}
              style={{
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderTop: `2px solid ${COLORS.gold}`,
                borderRadius: 6,
                padding: "16px 18px",
              }}
            >
              <div style={{ fontSize: 10, letterSpacing: 1.5, color: COLORS.textMuted, fontWeight: 700, marginBottom: 6 }}>
                {m.label}
              </div>
              <div style={{ fontFamily: MONO_FONT, fontSize: 24, fontWeight: 700, color: COLORS.text }}>
                {m.value}
              </div>
              <div style={{ fontSize: 10.5, color: COLORS.goldDim, marginTop: 4 }}>{m.note}</div>
            </div>
          ))}
        </div>

        {/* ---------------- FILM STRIP: RECOMMENDATIONS ---------------- */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: COLORS.gold, fontWeight: 700, marginBottom: 10 }}>
            FULL REEL — TOP 6 RECOMMENDATIONS
          </div>
        </div>
        <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "6px 0" }}>
          <Sprockets />
          <div style={{ display: "flex", overflowX: "auto", gap: 0, padding: "16px 4px" }}>
            {recs.map((m, i) => (
              <div
                key={m.title}
                style={{
                  minWidth: 168,
                  padding: "0 16px",
                  borderRight: i < recs.length - 1 ? `1px dashed ${COLORS.border}` : "none",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 90,
                    borderRadius: 5,
                    background: `linear-gradient(160deg, ${i % 2 === 0 ? COLORS.teal : COLORS.goldDim}, ${COLORS.bg})`,
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: DISPLAY_FONT,
                    fontSize: 26,
                    fontWeight: 700,
                    color: "rgba(242,237,228,0.55)",
                  }}
                >
                  {m.title.charAt(0)}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, lineHeight: 1.25, minHeight: 33 }}>
                  {m.title}
                </div>
                <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 6 }}>{m.genre}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Stars value={m.predicted} />
                  <span style={{ fontFamily: MONO_FONT, fontSize: 11, color: COLORS.gold, fontWeight: 700 }}>
                    {m.predicted.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Sprockets />
        </div>

        {/* ---------------- RATING DISTRIBUTION CHART ---------------- */}
        <div style={{ marginTop: 40 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: COLORS.gold, fontWeight: 700, marginBottom: 14 }}>
            DATASET RATING DISTRIBUTION
          </div>
          <div style={{ background: COLORS.bgPanel, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "20px 20px 8px" }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={RATING_DISTRIBUTION} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="rating"
                  tick={{ fill: COLORS.textMuted, fontSize: 12, fontFamily: MONO_FONT }}
                  axisLine={{ stroke: COLORS.border }}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "rgba(212,162,76,0.08)" }}
                  contentStyle={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 6, fontSize: 12 }}
                  labelStyle={{ color: COLORS.gold }}
                  itemStyle={{ color: COLORS.text }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {RATING_DISTRIBUTION.map((entry, i) => (
                    <Cell key={i} fill={i === 3 ? COLORS.gold : COLORS.teal} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ---------------- FOOTER NOTE ---------------- */}
        <div style={{ marginTop: 40, fontSize: 11, color: COLORS.textMuted, lineHeight: 1.6, borderTop: `1px solid ${COLORS.border}`, paddingTop: 18 }}>
          Predictions are generated from a mean-centered, item-based collaborative filtering model trained on user rating history — no movie metadata (genre, cast, synopsis) is used as model input. Displayed data is illustrative; connect to the live <code style={{ color: COLORS.gold }}>predicted_ratings_df</code> output to replace mock values.
        </div>
      </div>
    </div>
  );
}
