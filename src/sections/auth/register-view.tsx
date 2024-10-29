import { useState } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'src/routes/hooks';
import axios from 'axios';

// ----------------------------------------------------------------------

export function RegisterView() {
  const [formData, setFormData] = useState({
    name: '',
    document: '',
  });
  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      document: formData.document,
      type: "DEMO",
      is_active: true,
    };

    try {
      const token = 'nf184jew4873hfj33hd8wlsAsS2hwuhdwey'
      const response = await axios.post('https://stock-admin-backend.vercel.app/companies', payload, {
        headers: {
          'Content-Type': 'application/json',
          token
        },
        withCredentials: true
      });

      if (response.data && response.data._id) {
        router.push(`/create-user?companyId=${response.data._id}`);
      }
    } catch (error) {
      throw new Error('Erro criar empresa',error);
    }
  };

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Comece cadastrando sua empresa</Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" alignItems="flex-end">
        <TextField
          fullWidth
          name="name"
          label="Nome da empresa"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
          value={formData.name}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          name="document"
          label="Documento"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
          value={formData.document}
          onChange={handleChange}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="contained"
        >
          Registrar
        </LoadingButton>
      </Box>
    </>
  );
}
