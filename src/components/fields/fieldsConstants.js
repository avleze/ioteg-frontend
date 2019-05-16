export const generationsByType = {
    "Integer": ["Fixed", "Sequential", "Random"],
    "Long": ["Fixed", "Sequential", "Random"],
    "Float": ["Fixed", "Sequential", "Random", "CustomBehaviour"],
    "Date": ["Fixed", "Sequential", "Random"],
    "Time": ["Fixed", "Sequential", "Random"],
    "String": ["Fixed", "Sequential", "Random"],
    "Alphanumeric": ["Fixed", "Sequential", "Random"],
    "Boolean": ["Fixed", "Random"],
    "ComplexType": ["Complex"]
}

const normalSequentialFields = [
    {
        id: "begin",
        name: "begin",
        type: "text",
        label: "Begin",
        errorField: "begin",
        xs: 12,
        md: 6,
        lg: 6
    },
    {
        id: "end",
        name: "end",
        type: "text",
        label: "End",
        errorField: "end",
        xs: 12,
        md: 6,
        lg: 6
    },
    {
        id: "step",
        name: "step",
        type: "number",
        label: "Step",
        errorField: "step",
        xs: 12,
        md: 6,
        lg: 6
    }
]

const normalFixedFields = [
    {
        id: "value",
        name: "value",
        type: "text",
        label: "Value",
        errorField: "value",
        xs: 12,
        md: 6,
        lg: 6
    }
];

const normalRandomFields = [
    {
        id: "min",
        name: "min",
        type: "number",
        label: "Minimum",
        errorField: "min",
        xs: 12,
        md: 6,
        lg: 6
    },
    {
        id: "max",
        name: "max",
        type: "number",
        label: "Maximum",
        errorField: "max",
        xs: 12,
        md: 6,
        lg: 6
    }
]

const unitField = {
    id: "unit",
    name: "unit",
    type: "select",
    label: "Unit",
    errorField: "unit",
    items: ["MILLISECOND", "SECOND", "MINUTE", "HOUR", "DAY", "MONTH", "YEAR"],
    xs: 12,
    md: 6,
    lg: 6
}

const precisionField = {
    id: "precision",
    name: "precision",
    type: "number",
    label: "Precision",
    errorField: "precision",
    xs: 12,
    md: 6,
    lg: 6
}

const isNumericField = {
    id: "isNumeric",
    name: "isNumeric",
    type: "switch",
    label: "Is numeric",
    errorField: "isNumeric",
    xs: 12,
    md: 6,
    lg: 6
}

const lengthField = {
    id: "length",
    name: "length",
    type: "number",
    label: "Length",
    errorField: "length",
    xs: 12,
    md: 6,
    lg: 6
}

const formatField = {
    id: "format",
    name: "format",
    type: "text",
    label: "Format",
    errorField: "format",
    xs: 12,
    md: 6,
    lg: 6
}

const endCharacterField = {
    id: "endcharacter",
    name: "endcharacter",
    type: "text",
    label: "End character",
    errorField: "encharacter",
    xs: 12,
    md: 6,
    lg: 6
}

const dependenceField = {
    id: "dependence",
    name: "dependence",
    type: "text",
    label: "Dependence",
    errorField: "dependence",
    xs: 12,
    md: 6,
    lg: 6
}

const chooseoneField = {
    id: "chooseone",
    name: "chooseone",
    type: "switch",
    label: "Choose one",
    errorField: "chooseone",
    xs: 12,
    md: 6,
    lg: 6
}

const strCase = {
    id: "strCase",
    name: "strCase",
    type: "switch",
    label: "Case",
    errorField: "strCase",
    xs: 12,
    md: 6,
    lg: 6
}

const simulationsField = {
    id: "customBehaviour.simulations",
    name: "customBehaviour.simulations",
    type: "number",
    label: "Simulations",
    errorField: "customBehaviour.simulations",
    xs: 12,
    md: 6,
    lg: 6
}

export const propertiesByType = {
    "Integer": [],
    "Float": [precisionField],
    "Long": [],
    "Boolean": [isNumericField],
    "String": [],
    "Alphanumeric": [],
    "Date": [formatField],
    "Time": [formatField],
    "ComplexType": [dependenceField, chooseoneField]
}

export const fieldsByTypeAndGeneration = {
    "Integer": {
        "Fixed": normalFixedFields,
        "Sequential": normalSequentialFields,
        "Random": normalRandomFields
    },
    "Long": {
        "Fixed": normalFixedFields,
        "Sequential": normalSequentialFields,
        "Random": normalRandomFields
    },
    "Float": {
        "Fixed": normalFixedFields,
        "Sequential": normalSequentialFields,
        "Random": normalRandomFields,
        "CustomBehaviour": [simulationsField]
    },
    "Date": {
        "Fixed": normalFixedFields,
        "Sequential": [...normalSequentialFields, unitField],
        "Random": [],
    },
    "Time": {
        "Fixed": normalFixedFields,
        "Sequential": [...normalSequentialFields, unitField],
        "Random": [],
    },
    "String": {
        "Fixed": normalFixedFields,
        "Sequential": normalSequentialFields,
        "Random": [lengthField, endCharacterField, strCase],
    },
    "Alphanumeric": {
        "Fixed": normalFixedFields,
        "Sequential": normalSequentialFields,
        "Random": [lengthField, endCharacterField, strCase],
    },
    "Boolean": {
        "Fixed": normalFixedFields,
        "Random": [],
    },
    "ComplexType": {
        "Complex": []
    }
}