import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const DonationCard = ({
  id,
  title,
  description,
  category,
  location,
  contact,
  quantity,
  imageUrl,
  donorName,
  date,
  onClaim,
  userRole
}) => {
  const router = useRouter();

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'food': return 'restaurant';
      case 'clothing': return 'shirt';
      case 'hygiene': return 'medical';
      default: return 'gift';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'food': return '#28A745';
      case 'clothing': return '#FF6B00';
      case 'hygiene': return '#17A2B8';
      default: return '#6C757D';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleCardPress = () => {
    if (userRole === 'worker') {
      router.push(`/food_donation/donation-details?id=${id}`);
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={handleCardPress}
      activeOpacity={userRole === 'worker' ? 0.7 : 1}
    >
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.image}
          />
        ) : (
          <View style={[styles.placeholderImage, { backgroundColor: getCategoryColor(category) }]}>
            <Ionicons name={getCategoryIcon(category)} size={32} color="#fff" />
          </View>
        )}
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(category) }]}>
          <Text style={styles.categoryText}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        
        <View style={styles.details}>
          {quantity && (
            <View style={styles.detailRow}>
              <Ionicons name="scale" size={16} color="#666" />
              <Text style={styles.detailValue}>{quantity}</Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.detailValue}>{location}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="call" size={16} color="#666" />
            <Text style={styles.detailValue}>{contact}</Text>
          </View>
          
          {donorName && (
            <View style={styles.detailRow}>
              <Ionicons name="person" size={16} color="#666" />
              <Text style={styles.detailValue}>{donorName}</Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Ionicons name="time" size={16} color="#666" />
            <Text style={styles.detailValue}>{formatDate(date)}</Text>
          </View>
        </View>
        
        {userRole === 'worker' && onClaim && (
          <TouchableOpacity 
            style={styles.claimButton}
            onPress={(e) => {
              e.stopPropagation();
              onClaim();
            }}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.claimButtonText}>Claim Donation</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
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
  placeholderImage: {
    width: '100%',
    height: 128,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
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
    lineHeight: 20,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  claimButton: {
    backgroundColor: '#28A745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DonationCard; 