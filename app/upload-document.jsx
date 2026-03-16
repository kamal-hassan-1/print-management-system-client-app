//----------------------------------- IMPORTS -----------------------------------//

import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import config from "../config/config";
import { colors } from "../constants/colors";
import DocumentCard from "./components/uploadDocument/DocumentCard";

//----------------------------------- CONSTANTS ------------------------------------//

const API_BASE_URL = config.apiBaseUrl;

//----------------------------------- COMPONENTS -----------------------------------//

const UploadDocument = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const shopId = params.shopId;
  const shopName = params.shopName;

  useEffect(() => {
    if (!shopId || !shopName) {
      Alert.alert("Error", "Shop information not found. Please go back and select a shop.");
      router.back();
    }
  }, [router, shopId, shopName]);

  const handleDocumentPick = async () => {
    try {
      setError(null);
      setLoading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/plain",
          "image/jpeg",
          "image/png",
          "image/jpg",
        ],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled) {
        const newDocs = result.assets.map((file) => ({
          file,
          name: file.name ? file.name.replace(/\.[^/.]+$/, "") || "Document" : "Document",
        }));
        setDocuments((prev) => [...prev, ...newDocs]);
        setError(null);
      }
    } catch (err) {
      console.error("Error picking document:", err);
      setError("Failed to pick document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveAll = () => {
    Alert.alert("Remove All", "Are you sure you want to remove all documents?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove All", style: "destructive", onPress: () => setDocuments([]) },
    ]);
  };

  const handleContinue = async () => {
    setLoading(true);
    setError(null);
    const fileIds = [];
    const failedDocs = [];
    const token = await SecureStore.getItemAsync("authToken");
    try {
      for (const doc of documents) {
        const formData = new FormData();
        formData.append("file", {
          uri: doc.file.uri,
          name: doc.file.name,
          type: doc.file.mimeType,
        });
        const fileId = await uploadDocument(formData, doc.file.name, token);
        if (fileId) {
          fileIds.push(fileId);
        } else {
          failedDocs.push(doc.file.name);
        }
      }
      if (failedDocs.length === 0) {
        setDocuments([]);
        router.push({ pathname: "/print-settings", params: { shopId, documents: JSON.stringify(fileIds), numberOfDocuments: fileIds.length } });
      } else {
        setError(`${failedDocs.length} document(s) failed to upload: ${failedDocs.join(", ")}. Please try again.`);
      }
    } catch (err) {
      console.error("Error uploading documents:", err);
      setError("Failed to upload documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (formData, fileName, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/files`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const body = await response.json();
      console.log(fileName, " : ", body);
      if (response.status === 201) {
        console.log("Document uploaded successfully named ", fileName, " with id ", body.data.fileId);
        return body.data.fileId;
      } else {
        console.log("error in uploading document named ", fileName, ":", body.message);
        return null;
      }
    } catch (err) {
      console.error("Network error uploading ", fileName, ":", err);
      return null;
    }
  };

  const hasDocuments = documents.length > 0;
  const allNamesValid = documents.every((d) => d.name.trim());
  const totalSize = documents.reduce((sum, d) => sum + (d.file.size || 0), 0);

  //----------------------------------- RENDER -----------------------------------//

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Documents</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents {hasDocuments ? `(${documents.length})` : ""}</Text>

          {/* Empty state - upload area */}
          {!hasDocuments && !loading && (
            <TouchableOpacity style={styles.uploadArea} onPress={handleDocumentPick}>
              <Feather name="upload-cloud" size={48} color={colors.primary} />
              <Text style={styles.uploadText}>Upload Your Documents</Text>
              <Text style={styles.uploadSubtext}>Tap to select PDF, Word, Excel, or Image files</Text>
            </TouchableOpacity>
          )}

          {/* Loading state */}
          {loading && (
            <View style={[styles.uploadArea, styles.uploadAreaFilled]}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.uploadLoadingText}>Processing...</Text>
            </View>
          )}

          {/* Document cards list */}
          {hasDocuments && (
            <View style={styles.documentsList}>
              {documents.map((doc, index) => (
                <DocumentCard key={`${doc.file.uri}-${index}`} doc={doc} index={index} onRemove={handleRemoveDocument} />
              ))}
            </View>
          )}

          {/* Add more files button */}
          {hasDocuments && !loading && (
            <TouchableOpacity style={styles.addMoreButton} onPress={handleDocumentPick}>
              <Feather name="plus-circle" size={20} color={colors.primary} />
              <Text style={styles.addMoreButtonText}>Add More Files</Text>
            </TouchableOpacity>
          )}

          {error && (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={18} color={colors.printRequest} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        {/* Summary Card */}
        {hasDocuments && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Shop</Text>
              <Text style={styles.summaryValue}>{shopName}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Documents</Text>
              <Text style={styles.summaryValue}>
                {documents.length} file{documents.length !== 1 ? "s" : ""}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Size</Text>
              <Text style={styles.summaryValue}>{(totalSize / 1024).toFixed(2)} KB</Text>
            </View>
          </View>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, (!hasDocuments || !allNamesValid || loading) && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!hasDocuments || !allNamesValid || loading}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Feather name="arrow-right" size={20} color={colors.cardBackground} />
        </TouchableOpacity>

        {hasDocuments && (
          <TouchableOpacity style={styles.removeButton} onPress={handleRemoveAll}>
            <Text style={styles.removeButtonText}>Remove All Documents</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

//----------------------------------- STYLES -----------------------------------//

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.cardBackground,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 160,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: colors.borderLight,
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    minHeight: 200,
  },
  uploadAreaFilled: {
    borderColor: colors.primary,
    backgroundColor: "rgba(0, 217, 163, 0.05)",
  },
  uploadText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  uploadSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  uploadLoadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  // Add more button
  addMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    borderStyle: "dashed",
    backgroundColor: "rgba(0, 217, 163, 0.04)",
    gap: 8,
  },
  addMoreButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(255, 139, 123, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    gap: 12,
  },
  errorText: {
    fontSize: 13,
    color: colors.printRequest,
    flex: 1,
    lineHeight: 18,
  },

  // Summary card
  summaryCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 20,
  },
  summaryItem: {
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.cardBackground,
    padding: 20,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
    gap: 12,
  },
  continueButton: {
    backgroundColor: colors.printRequest,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonDisabled: {
    backgroundColor: colors.borderLight,
    opacity: 0.6,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.cardBackground,
  },
  removeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.printRequest,
    borderRadius: 12,
    alignItems: "center",
  },
  removeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.printRequest,
  },
});

export default UploadDocument;
