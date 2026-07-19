export type Estado = "Al día" | "Pendiente" | "En proceso" | "Vencido" | "N/A";

export type Responsable = { initials: string; name: string };

export const responsables: Record<string, Responsable> = {
  AM: { initials: "AM", name: "A. Machado" },
  RM: { initials: "RM", name: "R. Marín" },
  JV: { initials: "JV", name: "J. Vargas" },
  LP: { initials: "LP", name: "L. Peña" },
  CG: { initials: "CG", name: "C. Guédez" },
};

export type Cliente = { name: string; rif: string };

export const clientes: Cliente[] = [
  { name: "Inversiones Caracas C.A.", rif: "J-30492811-0" },
  { name: "Distribuidora Los Roques", rif: "J-41223904-1" },
  { name: "Manufacturas El Ávila", rif: "J-00219483-2" },
  { name: "Tecnología Orinoco S.A.", rif: "J-29503314-5" },
  { name: "Corporación Guayana C.A.", rif: "J-31558702-4" },
  { name: "Agroindustrial Portuguesa", rif: "J-40012287-7" },
  { name: "Servicios Marítimos La Guaira", rif: "J-29881143-9" },
  { name: "Constructora Andes 2000", rif: "J-30776612-3" },
];

export type Row = {
  cliente: Cliente;
  concepto: string;
  estado: Estado;
  vencimiento: string;
  monto: string;
  responsable: keyof typeof responsables;
};

export const tributarias: Row[] = [
  {
    cliente: clientes[0],
    concepto: "IVA SPE",
    estado: "Al día",
    vencimiento: "15-MAR-2024",
    monto: "124.500,00",
    responsable: "AM",
  },
  {
    cliente: clientes[1],
    concepto: "IVA SPO",
    estado: "En proceso",
    vencimiento: "18-MAR-2024",
    monto: "8.240,50",
    responsable: "RM",
  },
  {
    cliente: clientes[2],
    concepto: "RET ISLR",
    estado: "Vencido",
    vencimiento: "10-MAR-2024",
    monto: "45.120,00",
    responsable: "AM",
  },
  {
    cliente: clientes[3],
    concepto: "Alcaldía",
    estado: "Al día",
    vencimiento: "30-MAR-2024",
    monto: "3.400,00",
    responsable: "JV",
  },
  {
    cliente: clientes[4],
    concepto: "DPP",
    estado: "Pendiente",
    vencimiento: "22-MAR-2024",
    monto: "17.800,00",
    responsable: "LP",
  },
  {
    cliente: clientes[5],
    concepto: "IVA SPE",
    estado: "Al día",
    vencimiento: "15-MAR-2024",
    monto: "89.660,00",
    responsable: "CG",
  },
  {
    cliente: clientes[6],
    concepto: "RET ISLR",
    estado: "En proceso",
    vencimiento: "10-MAR-2024",
    monto: "12.410,25",
    responsable: "RM",
  },
  {
    cliente: clientes[7],
    concepto: "Alcaldía",
    estado: "Vencido",
    vencimiento: "05-MAR-2024",
    monto: "6.780,00",
    responsable: "JV",
  },
];

export const parafiscales: Row[] = [
  {
    cliente: clientes[0],
    concepto: "FAOV",
    estado: "Al día",
    vencimiento: "05-MAR-2024",
    monto: "9.420,00",
    responsable: "LP",
  },
  {
    cliente: clientes[1],
    concepto: "IVSS",
    estado: "Al día",
    vencimiento: "03-MAR-2024",
    monto: "14.200,00",
    responsable: "LP",
  },
  {
    cliente: clientes[2],
    concepto: "INCES",
    estado: "Pendiente",
    vencimiento: "20-MAR-2024",
    monto: "3.870,00",
    responsable: "CG",
  },
  {
    cliente: clientes[3],
    concepto: "FONACIT SPE",
    estado: "En proceso",
    vencimiento: "25-MAR-2024",
    monto: "21.500,00",
    responsable: "AM",
  },
  {
    cliente: clientes[4],
    concepto: "FONACIT SPO",
    estado: "Al día",
    vencimiento: "25-MAR-2024",
    monto: "4.610,00",
    responsable: "RM",
  },
  {
    cliente: clientes[5],
    concepto: "RUPDAE",
    estado: "Vencido",
    vencimiento: "01-MAR-2024",
    monto: "1.250,00",
    responsable: "JV",
  },
  {
    cliente: clientes[6],
    concepto: "FAOV",
    estado: "Al día",
    vencimiento: "05-MAR-2024",
    monto: "7.980,00",
    responsable: "LP",
  },
  {
    cliente: clientes[7],
    concepto: "IVSS",
    estado: "Pendiente",
    vencimiento: "03-MAR-2024",
    monto: "10.330,00",
    responsable: "CG",
  },
];

export const libros: Row[] = [
  {
    cliente: clientes[0],
    concepto: "Libro Diario",
    estado: "Al día",
    vencimiento: "31-MAR-2024",
    monto: "—",
    responsable: "AM",
  },
  {
    cliente: clientes[1],
    concepto: "Libro Mayor",
    estado: "En proceso",
    vencimiento: "31-MAR-2024",
    monto: "—",
    responsable: "RM",
  },
  {
    cliente: clientes[2],
    concepto: "Libro de Inventario",
    estado: "Pendiente",
    vencimiento: "15-ABR-2024",
    monto: "—",
    responsable: "CG",
  },
  {
    cliente: clientes[3],
    concepto: "Libro de Actas",
    estado: "Al día",
    vencimiento: "N/A",
    monto: "—",
    responsable: "JV",
  },
  {
    cliente: clientes[4],
    concepto: "Libro de Accionistas",
    estado: "Al día",
    vencimiento: "N/A",
    monto: "—",
    responsable: "LP",
  },
  {
    cliente: clientes[5],
    concepto: "Libro Diario",
    estado: "Vencido",
    vencimiento: "28-FEB-2024",
    monto: "—",
    responsable: "AM",
  },
  {
    cliente: clientes[6],
    concepto: "Libro Mayor",
    estado: "Al día",
    vencimiento: "31-MAR-2024",
    monto: "—",
    responsable: "RM",
  },
  {
    cliente: clientes[7],
    concepto: "Libro de Inventario",
    estado: "En proceso",
    vencimiento: "15-ABR-2024",
    monto: "—",
    responsable: "CG",
  },
];

export const conceptosPorTab = {
  tributarias: ["IVA SPE", "IVA SPO", "DPP", "RET ISLR", "Alcaldía"],
  parafiscales: ["FAOV", "IVSS", "INCES", "FONACIT SPE", "FONACIT SPO", "RUPDAE"],
  libros: [
    "Libro de Actas",
    "Libro de Accionistas",
    "Libro de Inventario",
    "Libro Mayor",
    "Libro Diario",
  ],
} as const;
