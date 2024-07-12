import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Button({ textoBoton, accionBoton, color }) {
    // Definimos un objeto con los colores
    const Colores = {
        Naranja: '#F5853F',
        Gris: '#DFDFDF',
        Rojo: '#D00000',
    };

    // Si el color proporcionado coincide con una clave del objeto Colores, usamos ese color
    const buttonColor = Colores[color] || color;

    return (
        <TouchableOpacity style={[styles.button, { backgroundColor: buttonColor, borderColor: buttonColor }]} onPress={accionBoton}>
            <Text style={styles.buttonText}>{textoBoton}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        width: 185,
        borderRadius: 13,
        padding: 10,
    },
    buttonText: {
        textAlign: 'center',
        color: "#FFF",
        fontWeight: '800',
        fontSize: 15,
    }
});
