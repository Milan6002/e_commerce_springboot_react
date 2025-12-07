package com.ecommerce.ecommerce.Services;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.ecommerce.ecommerce.Entity.ProductEntity;
import com.ecommerce.ecommerce.Entity.ProductImageEntity;
import com.ecommerce.ecommerce.Model.ProductModel;
import com.ecommerce.ecommerce.Repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ecommerce.ecommerce.Entity.CategoryEntity;
import com.ecommerce.ecommerce.Model.CategoryModel;
import com.ecommerce.ecommerce.Repository.CategoryRepository;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

@ExtendWith(MockitoExtension.class)
class AdminServiceImplementTest {

	@Mock
	CategoryRepository categoryRepository;

	@Mock
	ProductRepository productRepository;

	@InjectMocks
	AdminServiceImplement adminServiceImplement;

	@BeforeEach
	void beforeEach(){
		Mockito.reset(categoryRepository);
	}

	@Test
	void testAddCategory() {
		System.out.println("Add Category Test Case");

		// Arrange
		CategoryModel categoryModel = new CategoryModel();
		categoryModel.setCategory_id(1L);
		categoryModel.setCategory_name("Electronics");

		CategoryEntity savedEntity = new CategoryEntity();
		savedEntity.setCategory_id(1L);
		savedEntity.setCategory_name("Electronics");

		Mockito.when(categoryRepository.save(any(CategoryEntity.class))).thenReturn(savedEntity);
		String result = adminServiceImplement.addCategory(categoryModel);

		// Assert
		assertEquals("Category Added Successfully", result);
		verify(categoryRepository, times(1)).save(any(CategoryEntity.class));
	}

	@Test
	void testAddCategoryThrowsRuntimeException(){

		CategoryModel categoryModel = new CategoryModel();
		categoryModel.setCategory_id(1L);
		categoryModel.setCategory_name("");

		RuntimeException runtimeException = assertThrows(RuntimeException.class,() -> adminServiceImplement.addCategory(categoryModel));
		assertEquals("Invalid name of Category",runtimeException.getMessage());
		verify(categoryRepository,never()).save(any());

	}

	@Test
	void testPrivateMethod_validateCategoryName() throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
		Method validateCategoryName = AdminServiceImplement.class.getDeclaredMethod("validateCategoryName", String.class);
		validateCategoryName.setAccessible(true);
		Boolean categoryName = (Boolean) validateCategoryName.invoke(adminServiceImplement,"Electronics");
		assertTrue(categoryName);
	}

	@Test
	void testPrivateMethod_validateCategoryName_Invalid() throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
		Method validateCategoryName = AdminServiceImplement.class.getDeclaredMethod("validateCategoryName", String.class);
		validateCategoryName.setAccessible(true);
		Boolean categoryName = (Boolean) validateCategoryName.invoke(adminServiceImplement,"");
		assertFalse(categoryName);
	}

	@Test
	void testGetAllCategory(){
		System.out.println("Get List of Category Test");

		List<CategoryEntity> categoryEntities = new ArrayList<>();

		CategoryEntity category1 = new CategoryEntity();
		category1.setCategory_id(1L);
		category1.setCategory_name("Electronics");
		categoryEntities.add(category1);

		CategoryEntity category2 = new CategoryEntity();
		category2.setCategory_id(2L);
		category2.setCategory_name("Books");
		categoryEntities.add(category2);

		Mockito.when(categoryRepository.findAll()).thenReturn(categoryEntities);
		List<CategoryModel> result = adminServiceImplement.getAllCategory();

		assertEquals(categoryEntities.size(),result.size());
		assertEquals(categoryEntities.get(0).getCategory_id(),result.get(0).getCategory_id());
		assertEquals(categoryEntities.get(1).getCategory_id(),result.get(1).getCategory_id());

		Mockito.verify(categoryRepository,times(1)).findAll();

	}

	@Test
	void testDeleteCategory(){
		Long categoryId = 1L;
		String result  = adminServiceImplement.deleteCategory(categoryId);

		assertEquals("Category Deleted Successfully",result);
	}

	@Test
	void testUpdateCategory() {
		Long categoryId = 1L;

		// Input model with new name
		CategoryModel categoryModel = new CategoryModel();
		categoryModel.setCategory_id(categoryId);
		categoryModel.setCategory_name("Home Appliances");

		// Existing entity from the repository
		CategoryEntity existingEntity = new CategoryEntity();
		existingEntity.setCategory_id(categoryId);
		existingEntity.setCategory_name("Electronics"); // old name

		// Mock behavior
		Mockito.when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(existingEntity));
		Mockito.when(categoryRepository.save(Mockito.any(CategoryEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

		// Call service method
		String result = adminServiceImplement.updateCategory(categoryModel, categoryId);

		// Assert return value
		assertEquals("Category Updated Successfully", result);

		// Verify updated value
		assertEquals("Home Appliances", existingEntity.getCategory_name());

		// Optionally verify interactions
		Mockito.verify(categoryRepository).findById(categoryId);
		Mockito.verify(categoryRepository).save(existingEntity);
	}

	@Test
	void testGetCategoryById(){
		System.out.println("Get category by categoryId test case ");

		Long categoryId = 110L;
		CategoryEntity categoryEntity = new CategoryEntity();
		categoryEntity.setCategory_id(categoryId);
		categoryEntity.setCategory_name("Electronics");

		Mockito.when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(categoryEntity));

		CategoryModel result = adminServiceImplement.getCategoryById(categoryId);

		assertEquals(categoryId, result.getCategory_id());
		assertEquals("Electronics", result.getCategory_name());
	}

	@Test
	void testAddProduct() throws IOException {
		ProductModel productModel = new ProductModel();
		productModel.setProduct_id(1L);
		productModel.setProduct_brand("Motorola");
		productModel.setProduct_name("Motorola edge 50 Fusion");
		productModel.setDescription("Best Phone from Motorola");
		productModel.setProduct_color("Blue");
		productModel.setQuantity(10L);
		productModel.setPrice(21999L);
		productModel.setCategory_id(1L);

		byte[] imageBytes = "fake-image-content".getBytes();
		MockMultipartFile image1 = new MockMultipartFile("file","image1.jpg","image/jpeg",imageBytes);
		MockMultipartFile image2 = new MockMultipartFile("file","image2.jpg","image/jpeg",imageBytes);

		MultipartFile[] productImage = new MultipartFile[]{image1,image2};

		CategoryEntity categoryEntity = new CategoryEntity();
		categoryEntity.setCategory_id(1L);
		categoryEntity.setCategory_name("Smart Phone");

		Mockito.when(categoryRepository.findById(1L)).thenReturn(Optional.of(categoryEntity));
		Mockito.when(productRepository.save(any(ProductEntity.class))).thenAnswer(inv -> inv.getArgument(0));

		String result  = adminServiceImplement.addProducts(productModel,productImage);

		assertEquals("Product Added Successfully",result);

	}

	@Test
	void testGetAllProduct(){
		CategoryEntity categoryEntity = new CategoryEntity();
		categoryEntity.setCategory_id(1L);
		categoryEntity.setCategory_name("Smart Phone");

		byte[] imageByte1 = "fake-image-content".getBytes();
		byte[] imageByte2 = "fake-image-content".getBytes();

		ProductImageEntity image1 = new ProductImageEntity();
		image1.setId(1L);
		image1.setImage(imageByte1);

		ProductImageEntity image2 = new ProductImageEntity();
		image2.setId(2L);
		image2.setImage(imageByte2);

		List<ProductImageEntity> productImages = new ArrayList<>();
		productImages.add(image1);
		productImages.add(image2);

		List<ProductEntity> listOfProduct = new ArrayList<>();

		ProductEntity productEntity1 = new ProductEntity();
		productEntity1.setProduct_id(1L);
		productEntity1.setProduct_brand("Motorola");
		productEntity1.setProduct_name("Motorola edge 50 Fusion");
		productEntity1.setDescription("Best Phone from Motorola");
		productEntity1.setProduct_color("Blue");
		productEntity1.setQuantity(10L);
		productEntity1.setPrice(21999L);
		productEntity1.setCategory(categoryEntity);
		productEntity1.setProduct_images(productImages);

		ProductEntity productEntity2 = new ProductEntity();
		productEntity2.setProduct_id(2L);
		productEntity2.setProduct_brand("Motorola");
		productEntity2.setProduct_name("Motorola edge 60 Fusion");
		productEntity2.setDescription("Best Phone from Motorola");
		productEntity2.setProduct_color("Blue");
		productEntity2.setQuantity(10L);
		productEntity2.setPrice(21999L);
		productEntity2.setCategory(categoryEntity);
		productEntity2.setProduct_images(productImages);

		listOfProduct.add(productEntity1);
		listOfProduct.add(productEntity2);

		Mockito.when(productRepository.findAll()).thenReturn(listOfProduct);

		List<ProductModel> result = adminServiceImplement.getAllProduct();

		assertEquals(listOfProduct.size(),result.size());

		ProductModel productModel1 = result.getFirst();
		assertEquals(productModel1.getProduct_id(),productEntity1.getProduct_id());
		assertEquals(productModel1.getProduct_brand(),productEntity1.getProduct_brand());
		assertEquals(productModel1.getProduct_name(),productEntity1.getProduct_name());
		assertEquals(productModel1.getDescription(),productEntity1.getDescription());
		assertEquals(productModel1.getProduct_color(),productEntity1.getProduct_color());
		assertEquals(productModel1.getQuantity(),productEntity1.getQuantity());
		assertEquals(productModel1.getPrice(),productEntity1.getPrice());
		assertEquals(productModel1.getCategory_id(),productEntity1.getCategory().getCategory_id());
		assertArrayEquals(productModel1.getProduct_images().getFirst(),productEntity1.getProduct_images().getFirst().getImage());

		ProductModel productModel2 = result.get(1);
		assertEquals(productModel2.getProduct_id(),productEntity2.getProduct_id());
		assertEquals(productModel2.getProduct_brand(),productEntity2.getProduct_brand());
		assertEquals(productModel2.getProduct_name(),productEntity2.getProduct_name());
		assertEquals(productModel2.getDescription(),productEntity2.getDescription());
		assertEquals(productModel2.getProduct_color(),productEntity2.getProduct_color());
		assertEquals(productModel2.getQuantity(),productEntity2.getQuantity());
		assertEquals(productModel2.getPrice(),productEntity2.getPrice());
		assertEquals(productModel2.getCategory_id(),productEntity2.getCategory().getCategory_id());
		assertArrayEquals(productModel2.getProduct_images().get(1),productEntity2.getProduct_images().get(1).getImage());

		Mockito.verify(productRepository,times(1)).findAll();
	}

	@Test
	void testDeleteProduct(){
		Long productId = 1L;
		String result = adminServiceImplement.deleteProduct(productId);
		assertEquals("Product Deleted Successfully",result);
	}

	@Test
	void testUpdateProduct() throws IOException {
		Long productId = 1L;

		ProductModel productModel = new ProductModel();
		productModel.setProduct_id(productId);
		productModel.setProduct_brand("Motorola");
		productModel.setProduct_name("Motorola edge 50 Fusion");
		productModel.setDescription("Best Phone from Motorola");
		productModel.setProduct_color("Blue");
		productModel.setQuantity(10L);
		productModel.setPrice(21999L);
		productModel.setCategory_id(1L);
		productModel.setDiscount(30L);

		byte[] imageByte = "fake-image-path".getBytes();
		MockMultipartFile image1 = new MockMultipartFile("file","image1","image/jpeg",imageByte);
		MockMultipartFile image2 = new MockMultipartFile("file","image2","image/jpeg",imageByte);
		MultipartFile[] productImages = new MultipartFile[]{image1,image2};

		ProductImageEntity productImageEntity1 = new ProductImageEntity();
		productImageEntity1.setId(1L);
		productImageEntity1.setImage(imageByte);

		ProductImageEntity productImageEntity2 = new ProductImageEntity();
		productImageEntity2.setId(2L);
		productImageEntity2.setImage(imageByte);

		List<ProductImageEntity> productAllImages = new ArrayList<>();
		productAllImages.add(productImageEntity1);
		productAllImages.add(productImageEntity2);

		CategoryEntity categoryEntity = new CategoryEntity();
		categoryEntity.setCategory_id(1L);
		categoryEntity.setCategory_name("Mobile Phone");
		Mockito.when(categoryRepository.findById(productModel.getCategory_id())).thenReturn(Optional.of(categoryEntity));

		ProductEntity existingProduct = new ProductEntity();
		existingProduct.setProduct_images(productAllImages);
		Mockito.when(productRepository.findById(productId)).thenReturn(Optional.of(existingProduct));

		Mockito.when(productRepository.save(any(ProductEntity.class))).thenReturn(existingProduct);

		String result = adminServiceImplement.updateProduct(productId,productModel,productImages);
		assertEquals("Product Updated Successfully",result);

		assertEquals(productModel.getProduct_brand(),existingProduct.getProduct_brand());
		assertEquals(productModel.getProduct_name(),existingProduct.getProduct_name());
		assertEquals(productModel.getDescription(),existingProduct.getDescription());
		assertEquals(productModel.getProduct_color(),existingProduct.getProduct_color());
		assertEquals(productModel.getQuantity(),existingProduct.getQuantity());
		assertEquals(productModel.getPrice(),existingProduct.getPrice());
		assertEquals(productModel.getCategory_id(),existingProduct.getCategory().getCategory_id());
		assertEquals(productModel.getDiscount(),existingProduct.getDiscount());

		assertNotNull(existingProduct.getProduct_images());
		assertEquals(productAllImages.size(),existingProduct.getProduct_images().size());
		for (ProductImageEntity img : existingProduct.getProduct_images()) {
			assertArrayEquals(imageByte, img.getImage());
		}
	}

	@Test
	void testGetProductById() {
		Long productId = 1L;

		CategoryEntity categoryEntity = new CategoryEntity();
		categoryEntity.setCategory_id(1L);
		categoryEntity.setCategory_name("Smart Phone");

		byte[] image = "fake-image-demo".getBytes();
		ProductImageEntity image1 = new ProductImageEntity();
		image1.setId(1L);
		image1.setImage(image);

		ProductImageEntity image2 = new ProductImageEntity();
		image2.setId(2L);
		image2.setImage(image);

		List<ProductImageEntity> allImageOfProduct = new ArrayList<>();
		allImageOfProduct.add(image1);
		allImageOfProduct.add(image2);


		ProductEntity productEntity = new ProductEntity();
		productEntity.setProduct_id(productId);
		productEntity.setProduct_brand("Motorola");
		productEntity.setProduct_name("Motorola edge 50 Fusion");
		productEntity.setDescription("Best Phone from Motorola");
		productEntity.setProduct_color("Blue");
		productEntity.setQuantity(10L);
		productEntity.setPrice(21999L);
		productEntity.setCategory(categoryEntity);
		productEntity.setDiscount(30L);
		productEntity.setProduct_images(allImageOfProduct);

		Mockito.when(productRepository.findById(productId)).thenReturn(Optional.of(productEntity));

		ProductModel resultProductModel = adminServiceImplement.getProductById(productId);

		assertEquals(productEntity.getProduct_id(),resultProductModel.getProduct_id());
		assertEquals(productEntity.getProduct_brand(),resultProductModel.getProduct_brand());
		assertEquals(productEntity.getProduct_name(),resultProductModel.getProduct_name());
		assertEquals(productEntity.getDescription(),resultProductModel.getDescription());
		assertEquals(productEntity.getProduct_color(),resultProductModel.getProduct_color());
		assertEquals(productEntity.getQuantity(),resultProductModel.getQuantity());
		assertEquals(productEntity.getPrice(),resultProductModel.getPrice());
		assertEquals(productEntity.getCategory().getCategory_id(),resultProductModel.getCategory_id());
		assertEquals(productEntity.getDiscount(),resultProductModel.getDiscount());

		List<byte[]> resultImages = resultProductModel.getProduct_images();
		assertEquals(productEntity.getProduct_images().size(), resultImages.size());
		for (byte[] img : resultImages) {
			assertArrayEquals(image, img);
		}
	}

	@Test
	void testProductById_ProductNotFound(){
		Long productId = 10L;
		Mockito.when(productRepository.findById(productId)).thenReturn(Optional.empty());
		assertThrows(RuntimeException.class,() -> adminServiceImplement.getProductById(productId));
	}

	@Test
	void testGetProductByCategory(){
		Long categoryId = 1L;

		CategoryEntity categoryEntity = new CategoryEntity();
		categoryEntity.setCategory_id(categoryId);
		categoryEntity.setCategory_name("Smart Phone");
		Mockito.when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(categoryEntity));

		byte[] imageByte1 = "fake-image-content".getBytes();
		byte[] imageByte2 = "fake-image-content".getBytes();

		ProductImageEntity image1 = new ProductImageEntity();
		image1.setId(1L);
		image1.setImage(imageByte1);

		ProductImageEntity image2 = new ProductImageEntity();
		image2.setId(2L);
		image2.setImage(imageByte2);

		List<ProductImageEntity> productImages = new ArrayList<>();
		productImages.add(image1);
		productImages.add(image2);

		ProductEntity product1 = new ProductEntity();
		product1.setProduct_id(1L);
		product1.setProduct_brand("Motorola");
		product1.setProduct_name("Motorola edge 50 Fusion");
		product1.setDescription("Best Phone from Motorola");
		product1.setProduct_color("Blue");
		product1.setQuantity(10L);
		product1.setPrice(21999L);
		product1.setCategory(categoryEntity);
		product1.setProduct_images(productImages);

		ProductEntity product2 = new ProductEntity();
		product2.setProduct_id(2L);
		product2.setProduct_brand("Motorola");
		product2.setProduct_name("Motorola edge 50 Fusion");
		product2.setDescription("Best Phone from Motorola");
		product2.setProduct_color("Blue");
		product2.setQuantity(10L);
		product2.setPrice(21999L);
		product2.setCategory(categoryEntity);
		product2.setProduct_images(productImages);

		List<ProductEntity> productEntities =  new ArrayList<>();
		productEntities.add(product1);
		productEntities.add(product2);
		Mockito.when(productRepository.findByCategory(categoryEntity)).thenReturn(productEntities);

		List<ProductModel> resultProducts = adminServiceImplement.getProductByCategory(categoryId);

		ProductModel p1 = resultProducts.get(0);
		ProductModel p2 = resultProducts.get(1);

		assertEquals(productEntities.getFirst().getProduct_id(),p1.getProduct_id());
		assertEquals(productEntities.getFirst().getProduct_brand(),p1.getProduct_brand());
		assertEquals(productEntities.getFirst().getProduct_name(),p1.getProduct_name());
		assertEquals(productEntities.getFirst().getDescription(),p1.getDescription());
		assertEquals(productEntities.getFirst().getProduct_color(),p1.getProduct_color());
		assertEquals(productEntities.getFirst().getQuantity(),p1.getQuantity());
		assertEquals(productEntities.get(0).getPrice(),p1.getPrice());
		assertEquals(productEntities.get(0).getCategory().getCategory_id(),p1.getCategory_id());

		assertEquals(productEntities.get(1).getProduct_id(),p2.getProduct_id());
		assertEquals(productEntities.get(1).getProduct_brand(),p2.getProduct_brand());
		assertEquals(productEntities.get(1).getProduct_name(),p2.getProduct_name());
		assertEquals(productEntities.get(1).getDescription(),p2.getDescription());
		assertEquals(productEntities.get(1).getProduct_color(),p2.getProduct_color());
		assertEquals(productEntities.get(1).getQuantity(),p2.getQuantity());
		assertEquals(productEntities.get(1).getPrice(),p2.getPrice());
		assertEquals(productEntities.get(1).getCategory().getCategory_id(),p2.getCategory_id());
	}

	//	Do Nothing is used when you have a method which do not have any return type & verify is used to check that out given test case method is runs at least one time
	@Test
	void testDeleteById(){
		System.out.println("Example test of doNothing() and very ");
		Mockito.doNothing().when(categoryRepository).deleteById(202L);
		adminServiceImplement.deleteById(202L);
		Mockito.verify(categoryRepository,times(1)).deleteById(202L);
	}

}