import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { udyamitaTheme } from "../../config/styles/udyamitaTheme";
import { GreyLocation } from "../../assets/Icons/IconSvg";
import { useTranslation } from "react-i18next";

const {width,height}=Dimensions.get('window')
const BuzzTrackCard = ({ data }) => {
  const {t, i18n} = useTranslation();

  return (
    <View style={styles.card}>
        <View style={[styles.flexRow,{justifyContent:'flex-start',width:'100%'}]}>
        <Image source={{uri: data.imageUrl}} style={styles.image} />
        <View style={[styles.flexCol,{width:width-140}]}>

        <Text numberOfLines={1} ellipsizeMode="tail"  style={styles.title}>
          {data.en_name|| data.local_name || data.scientific_name } {data.en_name=='' ? null: <Text numberOfLines={1} ellipsizeMode="tail"  style={styles.subTitle}>({ data.local_name})</Text>}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail"  style={styles.text}> {t('flowering')} : {data.floweringPeriod}</Text>
        </View>
        </View>
      <View style={styles.content}>
       
        <View style={[styles.badgeContainer]}>
          <Text numberOfLines={1} ellipsizeMode="tail"  style={[styles.badge, styles.nectarBadge]}>
           <Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:14,
            fontWeight:'400',
            color:udyamitaTheme.textColor
           }}> {t('nectar')}: </Text>{data.nectar.level}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail"  style={[styles.badge, styles.pollenBadge]}>
          <Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:14,
            fontWeight:'400',
            color:udyamitaTheme.textColor
           }}> {t('pollen')}: </Text>
         {data.pollen.level}
          </Text>
        </View>
        <View style={[styles.flexRow,{alignItems:'center',gap:5}]}>
        <GreyLocation />
        <View style={[styles.flexCol]}>

        <Text numberOfLines={1} ellipsizeMode="tail"  style={styles.location}>{data.distance_in_str}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail"  style={styles.text}>
          {t('district')}: {data.district}  {t('state')}: {data.state}
        </Text>
        </View>
        </View>
        <View style={styles.verifiedContainer}>

          {data.verified && <View style={[styles.flexRow,{alignItems:'center',gap:3}]}>
            <Image style={{width:18.8,height:18}} source={require('../../assets/images/verified.png')}/>
            <Text numberOfLines={1} ellipsizeMode="tail"  style={styles.verified}> {t('verifiedOnSite')}</Text>
            </View>}
          {data.organic &&
          <View style={[styles.flexRow,{alignItems:'center',gap:3}]}>
<Image style={{width:17,height:23}} source={require('../../assets/images/organicsymbol.png')}/>
          <Text numberOfLines={1} ellipsizeMode="tail"  style={styles.organic}> {t('reportedorganic')}</Text>
          </View>
    }
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal:15,
    marginHorizontal: 20,
    marginVertical:7,
    flexDirection: "column",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 62,
    height: 62,
    borderRadius: 4,
    marginRight: 12,
  },
  content: {
    flex: 1,
    width:'100%'
  },
  title: {
    fontSize: 18,
    color:udyamitaTheme.textColor,
    fontWeight: "600",
  },
  subTitle: {
    color:udyamitaTheme.textColor,
    fontSize: 12,
    fontWeight:'400'
},
  text: {
    fontSize: 14,
    color: udyamitaTheme.textColor,
  },
  location: {
    fontSize: 16,
    fontWeight: "600",
    color:udyamitaTheme.textColor,
    marginVertical: 4,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap:'wrap',
    justifyContent:'flex-start',
    alignItems: "center",
    width:'100%',
    marginVertical: 8,
  },
  badge: {
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    marginRight: 6,
  },
  nectarBadge: {
    backgroundColor: "#CCFFCC",
    color: udyamitaTheme.textColor,
  },
  pollenBadge: {
    backgroundColor: "#FFF3D8",
    color: udyamitaTheme.textColor,
  },
  verifiedContainer: {
    flexDirection: "row",
    flexWrap:'wrap',
    alignContent:'center',
    alignItems:'center',
    marginTop: 6,
    marginLeft:5,
    gap:10,
  },
  verified: {
    fontSize: 12,
    color: udyamitaTheme.textColor,
    marginRight: 8,
  },
  organic: {
    fontSize: 12,
    color: udyamitaTheme.textColor,
  },
  flexRow:{
    flexDirection:'row',
  },
  flexCol:{
    flexDirection:'column'
  }
});

export default BuzzTrackCard;
