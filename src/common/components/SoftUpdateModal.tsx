import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import CustomText, { TextType } from './CustomText';
import CustomButton from './CustomButton';
import { Spacing } from '../../theme/spacing';

interface SoftUpdateModalProps {
  visible: boolean;
  isHardUpdate: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
}

const SoftUpdateModal = ({ visible, isHardUpdate, onUpdate, onDismiss }: SoftUpdateModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <CustomText type={TextType.ScreenHeadlineMedium}>
            {t(isHardUpdate ? 'appUpdate.hardTitle' : 'appUpdate.title')}
          </CustomText>
          <CustomText type={TextType.CardText} style={styles.desc}>
            {t(isHardUpdate ? 'appUpdate.hardMessage' : 'appUpdate.message')}
          </CustomText>
          <View style={styles.btnContainer}>
            <CustomButton
              title={t('appUpdate.updateButton')}
              onPress={onUpdate}
              variant="primary"
              uppercase={false}
              style={styles.btn}
            />
            {!isHardUpdate && (
              <CustomButton
                title={t('appUpdate.laterButton')}
                onPress={onDismiss}
                variant="outlined"
                uppercase={false}
                style={styles.btn}
              />
            )}
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
  desc: { textAlign: 'center', marginBottom: Spacing.l, marginTop: Spacing.xs },
  btn: { marginBottom: Spacing.m, width: '50%' },
  btnContainer: {
    flexDirection: 'row',
    gap: Spacing.m,
  },
});

export default SoftUpdateModal;
