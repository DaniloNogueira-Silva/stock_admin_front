import { useState, useEffect } from 'react';
import { useRouter } from 'src/routes/hooks';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';

// ----------------------------------------------------------------------

axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

export function CreateUserView() {
  const [formData, setFormData] = useState({
    companyId: '',
    name: '',
    email: '',
    password: '',
  });
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const companyId = params.get('companyId');
    if (companyId) {
      setFormData((prevData) => ({ ...prevData, companyId }));
    }
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
     const token = 'nf184jew4873hfj33hd8wlsAsS2hwuhdwey'
      const response = await axios.post('https://stock-admin-backend.vercel.app/users', formData, {
        headers: {
          'Content-Type': 'application/json',
          token
        },
        withCredentials: true
      });

      const loginForm = {
        email: formData.email,
        password: formData.password
      };

      const login = await axios.post('https://stock-admin-backend.vercel.app/auth/login', loginForm, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      if (login.data.token) {
        localStorage.setItem('token', login.data.token);
        router.push('/'); // Redireciona para a página inicial ou outra página
      }
    } catch (error) {
      throw new Error('Erro ao criar o usuário:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" alignItems="flex-end">
      <Typography variant="h5" sx={{ mb: 3 }}>Criação de Usuário</Typography>

      <TextField
        fullWidth
        name="name"
        label="Nome"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        value={formData.name}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        name="email"
        label="Email"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        value={formData.email}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        name="password"
        label="Senha"
        type="password"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        value={formData.password}
        onChange={handleChange}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
      >
        Criar Usuário
      </LoadingButton>
    </Box>
  );
}
