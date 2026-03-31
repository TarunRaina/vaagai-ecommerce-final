# Mapping of Indian Pincode prefixes (first 2 digits) to States/UTs
PINCODE_PREFIX_TO_STATE = {
    '11': ['Delhi'],
    '12': ['Haryana'], '13': ['Haryana'],
    '14': ['Punjab'], '15': ['Punjab'], '16': ['Punjab', 'Chandigarh'],
    '17': ['Himachal Pradesh'],
    '18': ['Jammu and Kashmir'], '19': ['Jammu and Kashmir'],
    '20': ['Uttar Pradesh'], '21': ['Uttar Pradesh'], '22': ['Uttar Pradesh'], '23': ['Uttar Pradesh'], 
    '24': ['Uttar Pradesh', 'Uttarakhand'], '25': ['Uttar Pradesh'], '26': ['Uttar Pradesh', 'Uttarakhand'],
    '27': ['Uttar Pradesh'], '28': ['Uttar Pradesh'],
    '30': ['Rajasthan'], '31': ['Rajasthan'], '32': ['Rajasthan'], '33': ['Rajasthan'], '34': ['Rajasthan'],
    '36': ['Gujarat'], '37': ['Gujarat'], '38': ['Gujarat'], '39': ['Gujarat', 'Dadra and Nagar Haveli and Daman and Diu'],
    '40': ['Maharashtra', 'Goa'], '41': ['Maharashtra'], '42': ['Maharashtra'], '43': ['Maharashtra'], '44': ['Maharashtra'],
    '45': ['Madhya Pradesh'], '46': ['Madhya Pradesh'], '47': ['Madhya Pradesh'], '48': ['Madhya Pradesh'],
    '49': ['Chhattisgarh'],
    '50': ['Telangana'],
    '51': ['Andhra Pradesh'], '52': ['Andhra Pradesh'], '53': ['Andhra Pradesh'],
    '56': ['Karnataka'], '57': ['Karnataka'], '58': ['Karnataka'], '59': ['Karnataka'],
    '60': ['Tamil Nadu', 'Puducherry'], '61': ['Tamil Nadu'], '62': ['Tamil Nadu'], '63': ['Tamil Nadu'], '64': ['Tamil Nadu'],
    '67': ['Kerala'], '68': ['Kerala', 'Lakshadweep'], '69': ['Kerala'],
    '70': ['West Bengal'], '71': ['West Bengal'], '72': ['West Bengal'], '73': ['West Bengal', 'Sikkim'],
    '74': ['West Bengal', 'Andaman and Nicobar Islands'],
    '75': ['Odisha'], '76': ['Odisha'], '77': ['Odisha'],
    '78': ['Assam'], '79': ['Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Tripura'],
    '80': ['Bihar'], '81': ['Bihar', 'Jharkhand'], '82': ['Bihar', 'Jharkhand'], '83': ['Bihar', 'Jharkhand'], 
    '84': ['Bihar'], '85': ['Bihar']
}

def get_states_from_pincode(pincode):
    if not pincode or len(pincode) < 2:
        return []
    prefix = pincode[:2]
    return PINCODE_PREFIX_TO_STATE.get(prefix, [])

def get_state_from_pincode(pincode):
    """Returns a single state name string or 'Unknown'"""
    states = get_states_from_pincode(pincode)
    if not states:
        return "Unknown"
    # Return first state (usually only one, except for shared prefixes like 60 (TN/Puducherry) or 40 (MH/Goa))
    return states[0]
