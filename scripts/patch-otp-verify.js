const fs = require('fs');
const path = require('path');

const modulePath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-otp-verify',
  'android',
  'src',
  'main',
  'java',
  'com',
  'faizal',
  'OtpVerify',
  'OtpVerifyModule.java',
);

if (!fs.existsSync(modulePath)) {
  process.exit(0);
}

const source = fs.readFileSync(modulePath, 'utf8');
if (!source.includes('Auth.GOOGLE_SIGN_IN_API')) {
  process.exit(0);
}

const patchedSource = source
  .replace('import com.google.android.gms.auth.api.Auth;\n', '')
  .replace('import com.google.android.gms.common.api.GoogleApiClient;\n', '')
  .replace('    private GoogleApiClient apiClient;\n', '')
  .replace(
    `        apiClient = new GoogleApiClient.Builder(reactContext)\n                .addApi(Auth.GOOGLE_SIGN_IN_API)\n                .build();\n`,
    '',
  );

fs.writeFileSync(modulePath, patchedSource);
