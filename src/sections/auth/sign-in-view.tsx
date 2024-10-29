import { useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import axios from 'axios';

// ----------------------------------------------------------------------

// Configura o interceptor para adicionar o token a todas as requisições
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

export function SignInView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post('https://stock-admin-backend.vercel.app/auth/login', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        router.push('/');
      }
    } catch (error) {
      throw new Error('Erro ao logar:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    router.push('/register');
  };

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Bem Vindo</Typography>
        <Typography variant="body2" color="text.secondary">
          Ainda não possui uma conta?
          <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={handleRegisterRedirect}>
            Comece agora
          </Link>
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" alignItems="flex-end">
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
          InputLabelProps={{ shrink: true }}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
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
          loading={loading}
        >
          Entrar
        </LoadingButton>
      </Box>
    </>
  );
}
