import React from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { udyamitaTheme } from "../../config/styles/udyamitaTheme";
import { CrossIcon, GreyLocation } from "../../assets/Icons/IconSvg";
import { useTranslation } from "react-i18next";

const {width,height}=Dimensions.get('window')
const BuzzInfoCardMap = ({ data , onclose }) => {
    const {t, i18n} = useTranslation();
    console.log(data);
  return (
    <View style={styles.card}>
        <View style={[styles.flexRow,{justifyContent:'flex-start',width:'100%'}]}>
        <Image source={require('../../assets/images/Carrot.png')} style={styles.image} />
        <View style={[styles.flexCol,{width:'100%'}]}>

        <Text numberOfLines={1} ellipsizeMode="tail"  style={styles.title}>
          {data.name} <Text numberOfLines={1} ellipsizeMode="tail"  style={styles.subTitle}>({data.commonName})</Text>
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail"  style={styles.text}>{t('flowering')}: {data.floweringPeriod}</Text>
        </View>
        </View>
      <View style={styles.content}>
       
        <View style={[styles.badgeContainer]}>
          <Text numberOfLines={1} ellipsizeMode="tail"  style={[styles.badge, styles.nectarBadge]}>
           <Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:14,
            fontWeight:'400',
            color:udyamitaTheme.textColor
           }}>{t('nectar')}: </Text>{data.nectar.level}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail"  style={[styles.badge, styles.pollenBadge]}>
          <Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:14,
            fontWeight:'400',
            color:udyamitaTheme.textColor
           }}>{t('pollen')}: </Text>
         {data.pollen.level}
          </Text>
        </View>
        <View style={[styles.flexRow,{alignItems:'center',gap:5,width:'100%'}]}>
        <GreyLocation />
        <View style={[styles.flexCol]}>

        <Text numberOfLines={1} ellipsizeMode="tail"  style={styles.location}>{data.distance}</Text>
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
          <Text numberOfLines={1} ellipsizeMode="tail"  style={styles.organic}> {t('reportedorganic')} </Text>
          </View>
    }
        </View>
      </View>

      <TouchableOpacity onPress={e=>onclose()} style={{
        position:'absolute',
        top:10,
        right: 10,
        height: 20,
        width: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <CrossIcon/>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position:'relative',
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal:15,
    // marginHorizontal: 20,
    marginHorizontal:20,
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
    // flex: 1,
    width:'100%',
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

export default BuzzInfoCardMap;
