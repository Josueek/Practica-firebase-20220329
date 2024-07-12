import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebase'; // Asegúrate de importar correctamente
import Button from '../components/Button';
import InputText from '../components/InputText';
import { useNavigation } from '@react-navigation/native';

export default function Registro() {
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');

    const navigation = useNavigation();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const Registrar = async () => {
        console.log('Botón de registro presionado');
        try {
            if (!correo || !clave || !nombre) {
                Alert.alert('Campos Incompletos', 'Por favor completa todos los campos.');
                return;
            }

            if (!validateEmail(correo)) {
                Alert.alert('Correo inválido', 'Por favor ingresa un correo electrónico válido.');
                return;
            }

            // Crear el usuario con email y contraseña en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, correo, clave);
            const userId = userCredential.user.uid;

            // Guardar los datos adicionales del cliente
            await setDoc(doc(collection(database, 'users'), userId), {
                nombre,
                telefono,
                correo,
            });

            Alert.alert('Registro exitoso', 'El usuario ha sido registrado correctamente.');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error al registrar:', error);
            Alert.alert('Error', 'Hubo un problema al registrar. Por favor, inténtalo de nuevo más tarde.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>¡Bienvenido!</Text>
            <View style={styles.row}>
                <View style={styles.column}>
                    <InputText
                        placeHolder={"Ingresa tu nombre"}
                        valor={nombre}
                        setTextChange={setNombre} />
                    <InputText
                        placeHolder={"Ingresa una clave"}
                        contra={true}
                        valor={clave}
                        setTextChange={setClave} />
                </View>
                <View style={styles.column}>
                    <InputText
                        placeHolder={"Ingresa tu correo electrónico"}
                        valor={correo}
                        setTextChange={setCorreo} />
                    <InputText
                        placeHolder={""}
                        contra={false}
                        valor={telefono}
                        setTextChange={setTelefono} />
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.column}>
                    <Button color={"Naranja"}
                        textoBoton={"Registrarse"}
                        accionBoton={Registrar}
                    />
                </View>
                <View style={styles.column}>
                    <Button color={"Gris"}
                        textoBoton={"Iniciar sesión"}
                        accionBoton={() => navigation.navigate('Login')}
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
    },
    column: {
        flex: 1,
        marginHorizontal: 10,
    },
    button: {
        marginTop: 30,
    },
});
