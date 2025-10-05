import { StyleSheet } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { colors } from '@theme/colors';

export const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: verticalScale(60),
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center'},
  logoIcon: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagerView: { flex: 1 },
  pageContainer: { flex: 1 },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: scale(32),
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(40),
  },
  iconContainer: { alignItems: 'center', marginBottom: verticalScale(60) },
  iconCircle: {
    width: scale(150),
    height: scale(150),
    borderRadius: scale(80),
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  textContainer: { alignItems: 'center', paddingHorizontal: scale(10) },
  title: { textAlign: 'center', marginBottom: verticalScale(15) },
  description: { textAlign: 'center', lineHeight: verticalScale(22) },
  bottomContainer: {
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(40),
    paddingTop: verticalScale(12),
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(28),
    gap: scale(6),
  },
  paginationDot: {
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: colors.primary,
  },
  buttonRow: { flexDirection: 'row', gap: scale(10) },
  backButton: {
    flex: 1,
    height: verticalScale(50),
    borderRadius: scale(16),
    borderWidth: 2,
    borderColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    flex: 1,
    height: verticalScale(50),
    borderRadius: scale(16),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  nextButtonFull: { flex: 1 },
});
