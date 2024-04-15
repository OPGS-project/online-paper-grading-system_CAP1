const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyBy5m7EE-frFkPUGdKadExH23n2qR6xnsY");

async function run() {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    {"question":"Mồm bò mà không phải mồm bò. Đố là con gì?","teacherAnswer":"Con ốc sên","grade":1,"studentAnswer":"Con ốc sên"}
    Chấm điểm cho tôi, theo json này nếu học sinh trả lời đúng với teacherAnswer trả ra true, sai trả ra false, nếu không hiểu để ra undefined. Chỉ trả cho tôi (true/false/ hoặc undefined)
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    //   console.log(result);
    console.log(text);
}

run();