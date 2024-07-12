import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

export default function InputText({ placeHolder, Valor, contra, setTextChange, editable = true }) {
    // Componente para establecer un estilo de input general en todo el proyecto
    return (
        <TextInput
            style={styles.Input}
            placeholder={placeHolder}
            value={Valor}
            placeholderTextColor={'#000'}
            secureTextEntry={contra}
            onChangeText={(text) => setTextChange(text)}
            editable={editable}
        />
    );
}

const styles = StyleSheet.create({
    Input: {
        backgroundColor: '#fff',
        fontFamily: 'Poppins',
        color: "#000",
        fontWeight: '300',
        width: 175,
        borderRadius: 20,
        borderColor: '#000',
        height: 45,
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
    },
});
