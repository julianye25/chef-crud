const d = document;

const userForm = d.getElementById('user');
const passwordForm = d.getElementById('password');
const loginBtn = d.getElementById('login');

loginBtn.addEventListener('click', () => {
  const dataUser = {
    user: userForm.value,
    password: passwordForm.value,
  };

  login(dataUser);
});

const login = async (data) => {
  const URL = 'http://localhost:3005/login';
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const dataUser = await response.json();

    if (dataUser.success === true) {
      location.href = './cajero.html';
    }
    console.log(dataUser);
  } catch (error) {
    console.error(error);
  }
};
