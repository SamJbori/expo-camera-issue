import React, { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import {
  CameraView,
  Camera,
  PermissionStatus,
  BarcodeScanningResult,
} from "expo-camera/next";
import { Portal } from "react-native-paper";

type Prop = {
  codeSet: (code: string) => void;
  cameraScanSet: (visible: boolean) => void;
};
export default ({ codeSet, cameraScanSet }: Prop) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();

      //   if (status==="")
      setHasPermission(status === PermissionStatus.GRANTED);
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ data, type }: BarcodeScanningResult) => {
    console.log(type, "==>>>Type");
    codeSet(data);
    cameraScanSet(false);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  return (
    <Portal>
      {!hasPermission && <Text>No permission</Text>}
      {hasPermission && (
        <CameraView
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["upc_a", "ean13", "ean8", "upc_e"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      )}
    </Portal>
  );
};
