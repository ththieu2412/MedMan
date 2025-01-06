import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Image, FlatList, Dimensions } from 'react-native';
import sliderList, { SliderItem } from '@/data/Slider';

const { width } = Dimensions.get('screen');

const Slider = () => {
    const flatListRef = useRef<FlatList<SliderItem>>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Tự động trượt slider
    useEffect(() => {
        const interval = setInterval(() => {
            goToNextSlide();
        }, 3000); // Trượt sau mỗi 3 giây
        return () => clearInterval(interval);
    }, [currentIndex]);

    // Hàm chuyển đến slide tiếp theo
    const goToNextSlide = () => {
        if (flatListRef.current) {
            const nextIndex = (currentIndex + 1) % sliderList.length;
            flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
            setCurrentIndex(nextIndex);
        }
    };

    // Hàm xử lý sự kiện trượt tay
    const handleScrollEnd = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / width);
        setCurrentIndex(index % sliderList.length);
    };

    return (
        <View style={styles.container}>
            {/* FlatList Slider */}
            <FlatList
                data={sliderList}
                ref={flatListRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onMomentumScrollEnd={handleScrollEnd}
                renderItem={({ item }) => (
                    <View style={styles.sliderItem}>
                        <Image source={item.image} style={styles.sliderImage} />
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
            />

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {sliderList.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index === currentIndex && styles.activeDot,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

export default Slider;

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    sliderItem: {
        width,
    },
    sliderImage: {
        width: width * 0.9,
        height: 170,
        borderRadius: 10,
        marginHorizontal: width * 0.05,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    dot: {
        height: 10,
        width: 10,
        backgroundColor: '#888',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#000',
    },
});
