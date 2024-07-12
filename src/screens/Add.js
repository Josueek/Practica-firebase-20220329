import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert } from 'react-native';
import { database, storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

// Componente Add para agregar o actualizar un producto
const Add = ({ navigation, route }) => {
    // Estado inicial del producto
    const [producto, setProducto] = useState({
        id: route?.params?.id || null,
        nombre: route?.params?.nombre || '',
        precio: route?.params?.precio || 0,
        vendido: route?.params?.vendido || false,
        creado: route?.params?.creado || new Date(),
        imagen: route?.params?.imagen || ''
    });

    // Función para navegar a la pantalla de inicio
    const goToHome = () => {
        navigation.navigate('Home');
    };

    // Función para abrir la galería de imágenes del dispositivo
    const openGalery = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [8, 8],
                quality: 1,
            });

            if (!result.canceled && result.assets.length > 0) {
                setProducto({
                    ...producto,
                    imagen: result.assets[0].uri
                });
                console.log('Imagen seleccionada:', result.assets[0].uri);
            }
        } catch (error) {
            console.log('Error al abrir la galería', error);
        }
    };

    // Función para agregar o actualizar el producto en Firestore
    const guardarProducto = async () => {
        try {
            let imageUrl = producto.imagen;

            if (producto.imagen && !producto.imagen.startsWith('http')) {
                console.log('Subiendo imagen a Firebase Storage...');
                const imageRef = ref(storage, `images/${Date.now()}-${producto.nombre}`);

                const response = await fetch(producto.imagen);
                const blob = await response.blob();

                console.log('Antes del uploadBytes');
                const snapshot = await uploadBytes(imageRef, blob);
                console.log('Snapshot después del uploadBytes:', snapshot);

                imageUrl = await getDownloadURL(snapshot.ref);
                console.log("URL de la imagen:", imageUrl);
            }

            const productoData = { ...producto, imagen: imageUrl };
            console.log('Datos del producto:', productoData);

            if (producto.id) {
                // Actualizar producto existente
                const productRef = doc(database, 'productos', producto.id);
                await setDoc(productRef, productoData);
                console.log('Producto actualizado');
            } else {
                // Agregar nuevo producto
                await addDoc(collection(database, 'productos'), productoData);
                console.log('Producto agregado');
            }

            Alert.alert('Producto guardado', 'El producto se guardó correctamente', [
                { text: 'Ok', onPress: goToHome },
            ]);

            goToHome();
        } catch (error) {
            console.error('Error al guardar el producto', error);
            Alert.alert('Error', 'Ocurrió un error al guardar el producto. Por favor, intenta nuevamente.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{producto.id ? 'Actualizar producto' : 'Agregar producto'}</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setProducto({ ...producto, nombre: text })}
                    value={producto.nombre}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Precio:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setProducto({ ...producto, precio: parseFloat(text) })}
                    value={producto.precio.toString()}
                    keyboardType='numeric'
                />
            </View>
            <Text>Imagen:</Text>
            <TouchableOpacity onPress={openGalery} style={styles.imagePicker}>
                <Text style={styles.imagePickerText}>Seleccionar Imagen</Text>
            </TouchableOpacity>
            {producto.imagen ? <Image source={{ uri: producto.imagen }} style={styles.imagePreview} /> : null}

            <TouchableOpacity style={styles.button} onPress={guardarProducto}>
                <Text style={styles.buttonText}>{producto.id ? 'Actualizar producto' : 'Agregar producto'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={goToHome}>
                <Text style={styles.buttonText}>Volver a home</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Add;

// Estilos del componente
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingLeft: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        width: '100%'
    },
    imagePicker: {
        backgroundColor: '#0288d1',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    imagePickerText: {
        color: 'white',
        fontWeight: 'bold',
    },
    imagePreview: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#0288d1',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    inputContainer: {
        width: '100%',
        padding: 16,
        backgroundColor: '#f8f9fa',
        marginBottom: 16,
    },
});
