const backendURL = 'https://your-backend-on-render.com'; // replace with actual backend URL

const startBtn = document.getElementById('startBtn');
const quizContainer = document.getElementById('quizContainer');
const resultDiv = document.getElementById('result');

startBtn.addEventListener('click', async () => {
  const section = document.getElementById('section').value;
  const phone = document.getElementById('phone').value.trim();

  if (!phone.startsWith('+254')) {
    alert('Use a valid phone number starting with +254');
    return;
  }

  // Simulate payment logic
  const confirmPay = confirm(`Proceed to pay for Section ${section}?`);
  if (!confirmPay) return;

  const res = await fetch(`${backendURL}/questions?section=${section}`);
  const questions = await res.json();

  quizContainer.innerHTML = '';
  resultDiv.innerHTML = '';
  quizContainer.style.display = 'block';

  questions.forEach((q, index) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p><strong>Q${index + 1}:</strong> ${q.text}</p>
      <input type="text" id="answer${index}" placeholder="Your answer">
    `;
    quizContainer.appendChild(div);
  });

  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Submit Answers';
  submitBtn.onclick = async () => {
    const answers = [];
    for (let i = 0; i < questions.length; i++) {
      const val = document.getElementById(`answer${i}`).value.trim();
      answers.push(val);
    }

    const submitRes = await fetch(`${backendURL}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, answers, phone })
    });

    const result = await submitRes.json();
    resultDiv.innerHTML = `<h3>${result.message}</h3>`;
    quizContainer.style.display = 'none';
  };

  quizContainer.appendChild(submitBtn);
});
