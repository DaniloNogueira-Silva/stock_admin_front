import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';

import axios from 'axios';

import { DashboardContent } from 'src/layouts/dashboard';
import { ProductItem } from '../product-item';
import { CartIcon } from '../product-cart-widget';

import type { ProductItemProps } from '../product-item';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export function ProductsView() {
  const [products, setProducts] = useState<ProductItemProps[]>([]);
  const [categories, setCategories] = useState([]);
  const [localizations, setLocalizations] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingImage, setLoadingImage] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    code: '',
    quantity: 0,
    categoryId: '',
    localizationId: '',
    image_url: '',
  });

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get('https://stock-admin-backend.vercel.app/products');
      const formattedProducts = response.data.map((product: any) => ({
        id: product._id,
        name: product.name,
        price: product.price,
        status: product.status || 'available',
        coverUrl: product.image_url,
        colors: product.colors || [],
        priceSale: product.priceSale || null,
      }));
      setProducts(formattedProducts);
      setLoadingProducts(false);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setLoadingProducts(false);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://stock-admin-backend.vercel.app/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const fetchLocalizations = async () => {
    try {
      const response = await axios.get('https://stock-admin-backend.vercel.app/localizations');
      setLocalizations(response.data);
    } catch (error) {
      console.error('Erro ao buscar localizações:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchLocalizations();
  }, [fetchProducts]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      setLoadingImage(true);

      try {
        const response = await axios.post(
          'https://stock-admin-backend.vercel.app/upload',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        setNewProduct((prev) => ({ ...prev, image_url: response.data.image }));
      } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
      } finally {
        setLoadingImage(false);
      }
    }
  };

  const handleCreateProduct = async () => {
    try {
      await axios.post('https://stock-admin-backend.vercel.app/products', {
        ...newProduct,
        quantity: Number(newProduct.quantity),
        price: Number(newProduct.price),
      });
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
    }
  };

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Produtos
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpenModal}
        size="small"
        sx={{
          mb: 3,
          maxWidth: '200px', // largura máxima do botão
          width: 'fit-content', // ajusta para o conteúdo
          px: 2, // padding horizontal para controlar o espaçamento interno
        }}
      >
        Adicionar Produto
      </Button>

      <CartIcon totalItems={8} />

      {loadingProducts ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid key={product.id} xs={12} sm={6} md={3}>
              <ProductItem product={product} />
            </Grid>
          ))}
        </Grid>
      )}

      <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} />

      <Modal open={openModal} onClose={handleCloseModal}>
        <Card sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Criar Produto
          </Typography>
          <Grid container spacing={2}>
            <Grid xs={12} md={6}>
              <TextField
                label="Nome"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                label="Descrição"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                label="Preço"
                name="price"
                type="number"
                value={Number(newProduct.price)}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                label="Código"
                name="code"
                value={newProduct.code}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                label="Quantidade"
                name="quantity"
                type="number"
                value={Number(newProduct.quantity)}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Categoria</InputLabel>
                <Select
                  name="categoryId"
                  value={newProduct.categoryId}
                  onChange={handleSelectChange}
                >
                  {categories.map((category: any) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Localização</InputLabel>
                <Select
                  name="localizationId"
                  value={newProduct.localizationId}
                  onChange={handleSelectChange}
                >
                  {localizations.map((localization: any) => (
                    <MenuItem key={localization._id} value={localization._id}>
                      {localization.address}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={6}>
              <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
                Upload Imagem
                <input type="file" hidden onChange={handleImageUpload} />
              </Button>
              {loadingImage && (
                <Box display="flex" justifyContent="center" sx={{ mt: 1 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </Grid>
            {newProduct.image_url && (
              <Grid xs={12} md={6}>
                <Box
                  component="img"
                  src={newProduct.image_url}
                  alt="Imagem do produto"
                  sx={{ width: '100%', height: 150, objectFit: 'cover', mt: 2 }}
                />
              </Grid>
            )}
          </Grid>
          <Button
            variant="contained"
            onClick={handleCreateProduct}
            sx={{ mt: 2 }}
            disabled={loadingImage}
          >
            Criar Produto
          </Button>
        </Card>
      </Modal>
    </DashboardContent>
  );
}
