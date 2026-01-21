import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useSessionTimeout } from '../../context/SessionTimeoutContext';
import CustomText, { TextType } from './CustomText';
import CustomButton from './CustomButton';
import { Spacing } from '../../theme/spacing';

const SessionTimeoutModal = () => {
    const { isModalVisible, handleStayLoggedIn, handleLogout } = useSessionTimeout();

    return (
        <Modal visible={isModalVisible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <CustomText type={TextType.ScreenDisplayLarge} style={styles.icon}>⏱️</CustomText>
                    <CustomText type={TextType.ScreenHeadlineMedium}>Session Timeout</CustomText>
                    <CustomText type={TextType.CardText} style={styles.desc}>
                        Your session is about to expire. Stay logged in?
                    </CustomText>
                    <View style={styles.btnContainer}>
                        <CustomButton
                            title="Stay Logged In"
                            onPress={handleStayLoggedIn}
                            variant="primary"
                            uppercase={false}
                            style={styles.btn}
                        />

                        <CustomButton
                            title="Logout"
                            onPress={handleLogout}
                            variant="outlined"
                            uppercase={false}
                            style={styles.btn}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: ms(16),
        padding: Spacing.xl,
        alignItems: 'center',
    },
    icon: { marginBottom: Spacing.s },
    desc: { textAlign: 'center', marginBottom: Spacing.l, marginTop: Spacing.xs },
    btn: { marginBottom: Spacing.m, width: '50%' },
    btnContainer: {
        flexDirection: 'row',
        gap: Spacing.m,
    },
});

export default SessionTimeoutModal;
