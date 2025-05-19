import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DonationCard = ({
  title,
  description,
  type,
  location,
  contact,
  date,
  imageUrl
}) => {
  const isNeed = type === 'need';
  
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {imageUrl && (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.image}
          />
        )}
        <View style={[
          styles.typeBadge,
          isNeed ? styles.needBadge : styles.offerBadge
        ]}>
          <Text style={styles.typeText}>
            {isNeed ? 'Needed' : 'Offering'}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Contact:</Text>
            <Text style={styles.detailValue}>{contact}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Posted:</Text>
            <Text style={styles.detailValue}>{date}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.actionButton,
            isNeed ? styles.needButton : styles.offerButton
          ]}
        >
          <Text style={styles.buttonText}>
            {isNeed ? 'I Can Help' : 'Request This'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 128,
  },
  typeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  needBadge: {
    backgroundColor: '#FF6B00',
  },
  offerBadge: {
    backgroundColor: '#28A745',
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  actionButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  needButton: {
    backgroundColor: '#FF6B00',
  },
  offerButton: {
    backgroundColor: '#28A745',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DonationCard; 