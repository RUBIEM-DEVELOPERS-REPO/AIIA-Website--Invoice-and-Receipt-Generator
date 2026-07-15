async function run() {
  try {
    const response = await fetch("https://api.smtp2go.com/v3/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    const data = await response.json();
    console.log("Success:", data);
  } catch (error) {
    console.error("Fetch failed:", error.message);
  }
}
run();
