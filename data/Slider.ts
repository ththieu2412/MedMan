import { ImageSourcePropType } from "react-native";

export interface SliderItem {
    id: number;
    name: string;
    image: ImageSourcePropType;
}

const sliderList: SliderItem[] = [
    {
        id: 1,
        name: 'Slider 1',
        image: require('@/assets/images/sliders/slider3.jpg'),
    },
    {
        id: 2,
        name: 'Slider 2',
        image: require('@/assets/images/sliders/slider2.jpg'),
    },
    {
        id: 3,
        name: 'Slider 3',
        image: require('@/assets/images/sliders/slider1.jpg'),
    },
    {
        id: 4,
        name: 'Slider 4',
        image: require('@/assets/images/sliders/slider4.jpg'),
    },
    {
        id: 5,
        name: 'Slider 5',
        image: require('@/assets/images/sliders/slider5.jpg'),
    },
];

export default sliderList;
