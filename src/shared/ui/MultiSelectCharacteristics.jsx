import React from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";

const MultiSelectCharacteristics = ({
  allCharacteristics,
  selectedCharacteristicIds,
  onSelectionChange,
}) => {
  const handleToggle = (characteristicId) => {
    const isSelected = selectedCharacteristicIds.includes(characteristicId);
    let newSelection;

    if (isSelected) {
      newSelection = selectedCharacteristicIds.filter(
        (id) => id !== characteristicId
      );
    } else {
      newSelection = [...selectedCharacteristicIds, characteristicId];
    }
    onSelectionChange(newSelection);
  };

  const selectedCount = selectedCharacteristicIds.length;
  const displayValue = selectedCount > 0
    ? `${selectedCount} característica(s) seleccionada(s)`
    : "Seleccione una o más características";

  const [open, setOpen] = React.useState(false);
  const menuHandlerRef = React.useRef(null);
  const [menuWidth, setMenuWidth] = React.useState(0);

  React.useEffect(() => {
    if (menuHandlerRef.current) {
      setMenuWidth(menuHandlerRef.current.offsetWidth);
    }
  }, [open]); // Recalculate width when menu opens/closes

  return (
    <Menu open={open} handler={setOpen} dismiss={{ itemPress: false }}>
      <MenuHandler ref={menuHandlerRef}>
    <Button
      variant="outlined"
      className="w-full text-left normal-case font-normal text-gray-700 border border-gray-300 rounded-lg p-3"
    >
      {displayValue}
    </Button>
  </MenuHandler>
  <MenuList className="max-h-72 overflow-y-auto">
    {allCharacteristics.map((char) => (
      <MenuItem
        key={char.featureId}
        className="p-0"
        dismiss={false}
        onClick={(e) => {
          e.stopPropagation();
          handleToggle(char.featureId);
        }}
      >
        <label
          htmlFor={`characteristic-${char.featureId}`}
          className="flex items-center w-full cursor-pointer px-3 py-2"
        >
          <Checkbox
            id={`characteristic-${char.featureId}`}
            ripple={false}
            checked={selectedCharacteristicIds.includes(char.featureId)}
            containerProps={{ className: "p-0" }}
            className="hover:before:opacity-0"
          />
          <Typography
            color="blue-gray"
            className="font-medium text-blue-gray-700 ml-2"
          >
            {char.featureName}
          </Typography>
        </label>
      </MenuItem>
    ))}
  </MenuList>
</Menu>

  );
};

export default MultiSelectCharacteristics;
