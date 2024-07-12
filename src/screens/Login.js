import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
// Librería de firebase para autenticar
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebase'; // Importa la configuración de Firebase
// Componentes
import Button from '../components/Button';
import InputText from '../components/InputText';
// Navegabilidad
import { useNavigation } from '@react-navigation/native';

export default function Login() {
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');

    // Navegación
    const navigation = useNavigation();

    // Validar el formato del correo
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };
    const volver = () =>{
        navigation.navigate('registro');
    }

    const IniciarSesion = async () => {
        console.log('Botón de iniciar sesión presionado');
        try {
            if (!correo || !clave) {
                Alert.alert('Campos Incompletos', 'Por favor completa todos los campos.');
                return;
            }

            if (!validateEmail(correo)) {
                Alert.alert('Correo inválido', 'Por favor ingresa un correo electrónico válido.');
                return;
            }

            // Iniciar sesión con email y contraseña en Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, correo, clave);
            const userId = userCredential.user.uid;

            // Verificar la existencia del usuario en Firestore
            const userDocRef = doc(database, 'users', userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                Alert.alert('Inicio de sesión exitoso', 'El usuario ha iniciado sesión correctamente.');
                // Redirigir a la siguiente pantalla
                navigation.navigate('Home'); // Asegúrate de que 'Home' es el nombre de la pantalla a la que deseas navegar
            } else {
                Alert.alert('Error', 'El usuario no existe en la base de datos.');
            }

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            Alert.alert('Error', 'Hubo un problema al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>

            <InputText
                placeHolder={"Ingresa tu correo electrónico"}
                valor={correo}
                setTextChange={setCorreo} />
            <InputText
                placeHolder={"Ingresa tu clave"}
                contra={true}
                valor={clave}
                setTextChange={setClave} />

            <View style={styles.row}>
                <View style={styles.column}>
                    <Button color={"Naranja"}
                        textoBoton={"Iniciar Sesión"}
                        accionBoton={IniciarSesion}
                    />
                </View>
                <View style={styles.column}>
                    <Button color={"Gris"}
                        textoBoton={"Registrarse"}
                        accionBoton={volver}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        color: '#F5853F',
        fontWeight: '800',
        fontSize: 30,
        marginBottom: 30,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 42,
    },
    column: {
        flex: 1,
        marginHorizontal: 10,
    },
    button: {
        marginTop: 30,
    },
});
