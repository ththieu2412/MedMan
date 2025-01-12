export type CustomInputProps = {
    label: string,
    icon?: React.ReactNode,
    placeholder: string,
    type: string,
    onChangeText?: (text: string) => void;
}