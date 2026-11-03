import { saveConsultation } from "./src/lib/consultations";

async function run() {
  const result = await saveConsultation({
    userId: "d9f9c0dc-02d1-6a04-961e-7bd655e80fe1", // Use the fake UUID
    name: "Test",
    birthdate: "1990-01-01",
    birthtime: "12:00",
    birth_place: "Test",
    year: "2026",
    mode: "futuro",
    goal: 5,
    intent: "amor",
    result: { results: {}, house: 5 }
  });
  console.log("Result:", result);
}
run();
