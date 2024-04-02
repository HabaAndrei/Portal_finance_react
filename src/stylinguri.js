import { styled } from "@mui/system";

const styleDoiJS = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const TransparentBackdrop = styled("div")({
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundalul complet transparent
});

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

export { styleDoiJS, TransparentBackdrop, VisuallyHiddenInput };
