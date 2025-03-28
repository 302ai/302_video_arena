import {
  Flux,
  Ideogram,
  OpenAI,
  Recraft,
  Stability,
  Kling,
  Luma,
  Runway,
  Haiper,
  Midjourney,
  ByteDance,
  PixVerse as Pixverse,
  Pika,
  Tiangong as Skyreels,
  Doubao as Seaweed,
  SiliconCloud as SiliconFlow,
  Qwen as Wanx,
  Lightricks as LTX,
  Google,
  Zhipu,
  Minimax,
} from "@lobehub/icons";
import { FC, SVGProps } from "react";
import { useTranslations } from "next-intl";

// Define model types
export type ModelType = "T2V" | "I2V" | "V2V" | "I2V_END";

export interface VideoModelInfo {
  id: string;
  name: string;
  alias: string;
  group: string;
  icon: any;
  type: ModelType[];
  description: string;
  supportsDuration?: boolean;
  supportsFps?: boolean;
  supportsEndImage?: boolean;
}

// Custom icons for providers not in @lobehub/icons

const Genmo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    style={{ display: "block" }}
    viewBox="0 0 1456 1448"
    width="364"
    height="362"
  >
    <defs>
      <linearGradient
        id="Gradient1"
        gradientUnits="userSpaceOnUse"
        x1="763.821"
        y1="151.261"
        x2="758.152"
        y2="147.336"
      >
        <stop
          className="stop0"
          offset="0"
          stop-opacity="0.956863"
          stop-color="rgb(232,25,74)"
        />
        <stop
          className="stop1"
          offset="1"
          stop-opacity="1"
          stop-color="rgb(227,28,72)"
        />
      </linearGradient>
      <linearGradient
        id="Gradient2"
        gradientUnits="userSpaceOnUse"
        x1="1112.07"
        y1="205.861"
        x2="976.052"
        y2="769.215"
      >
        <stop
          className="stop0"
          offset="0"
          stop-opacity="0.878431"
          stop-color="rgb(228,33,75)"
        />
        <stop
          className="stop1"
          offset="1"
          stop-opacity="0.894118"
          stop-color="rgb(249,70,97)"
        />
      </linearGradient>
      <linearGradient
        id="Gradient3"
        gradientUnits="userSpaceOnUse"
        x1="805.131"
        y1="432.55"
        x2="679.802"
        y2="1007.52"
      >
        <stop
          className="stop0"
          offset="0"
          stop-opacity="0.886275"
          stop-color="rgb(246,164,15)"
        />
        <stop
          className="stop1"
          offset="1"
          stop-opacity="0.905882"
          stop-color="rgb(252,196,41)"
        />
      </linearGradient>
      <linearGradient
        id="Gradient4"
        gradientUnits="userSpaceOnUse"
        x1="489.108"
        y1="650.862"
        x2="384.157"
        y2="1256.61"
      >
        <stop
          className="stop0"
          offset="0"
          stop-opacity="0.87451"
          stop-color="rgb(42,106,238)"
        />
        <stop
          className="stop1"
          offset="1"
          stop-opacity="0.890196"
          stop-color="rgb(62,133,248)"
        />
      </linearGradient>
      <linearGradient
        id="Gradient5"
        gradientUnits="userSpaceOnUse"
        x1="620.684"
        y1="695.799"
        x2="556.84"
        y2="986.93"
      >
        <stop
          className="stop0"
          offset="0"
          stop-opacity="1"
          stop-color="rgb(74,115,202)"
        />
        <stop
          className="stop1"
          offset="1"
          stop-opacity="1"
          stop-color="rgb(90,138,210)"
        />
      </linearGradient>
    </defs>
    <path
      transform="translate(0,0)"
      fill="rgb(223,74,93)"
      fill-opacity="0.976471"
      d="M 1245.38 821.911 C 1249.21 822.92 1262.04 823.325 1263.74 825.357 C 1261.55 826.219 1259.67 826.64 1257.34 826.939 C 1268.83 831.475 1297.34 837.392 1308.64 832.403 C 1314.57 829.788 1319.27 825.866 1324.86 822.806 C 1325.59 823.873 1325.65 824.037 1325.83 825.409 C 1324.95 826.243 1324.04 826.9 1323.03 827.567 C 1316.58 831.849 1310.84 834.64 1303.1 835.73 C 1283.13 838.544 1248.52 828.402 1227.95 824.266 L 1228.92 823.758 C 1232.36 821.915 1235.62 821.94 1239.42 821.77 L 1245.38 821.911 z"
    />
    <path
      transform="translate(0,0)"
      fill="url(#Gradient1)"
      d="M 774.02 133.18 L 779.46 133.238 L 780.65 134.521 C 779.091 140.786 761.691 151.805 757.182 159.682 C 749.586 172.95 755.555 186.813 751.319 200.36 C 750.048 190.22 749.294 180.407 749.303 170.185 C 747.582 177.461 748.32 185.325 747.858 192.796 C 745.972 223.298 746.729 254.174 746.686 284.732 C 746.668 297.559 747.83 311.832 746.1 324.512 C 746.066 324.035 746.026 323.559 745.999 323.081 C 744.627 298.962 745.737 274.169 745.746 249.989 C 745.755 226.019 743.187 186.695 748.431 164.392 C 750.583 155.24 755.392 148.277 761.533 141.339 C 765.543 137.834 769.198 135.448 774.02 133.18 z"
    />
    <path
      transform="translate(0,0)"
      fill="rgb(223,74,93)"
      fillOpacity="0.984314"
      d="M 746.1 324.512 C 747.83 311.832 746.668 297.559 746.686 284.732 C 746.729 254.174 745.972 223.298 747.858 192.796 C 748.32 185.325 747.582 177.461 749.303 170.185 C 749.294 180.407 750.048 190.22 751.319 200.36 C 751.856 255.539 753.119 310.808 752.612 365.982 C 752.485 379.794 754.332 393.995 753.425 407.716 C 753.123 412.281 751.484 416.276 749.774 420.459 L 746.056 419.911 L 746.302 419.303 C 747.22 410.085 746.243 399.485 746.225 390.108 L 746.1 324.512 z"
    />
    <path
      transform="translate(0,0)"
      fill="url(#Gradient2)"
      d="M 774.02 133.18 C 782.104 127.556 796.257 128.961 805.481 130.637 C 818.473 132.999 831.405 137.38 844.255 140.572 L 931.294 162.237 C 945.434 165.829 959.715 170.431 974.16 172.53 C 996.471 180.18 1021.66 185.831 1044.84 190.156 C 1060.23 195.247 1076.64 197.104 1091.85 202.363 L 1234.86 238.145 C 1252.81 242.78 1272.17 245.069 1289.19 252.519 C 1304.66 259.29 1319.93 268.835 1328.87 283.629 C 1335.04 293.838 1340.91 304.959 1342.07 316.932 C 1344.19 338.81 1342.79 361.708 1342.68 383.683 L 1342.66 491.959 L 1342.66 709.297 C 1342.66 728.42 1345.18 787.495 1341.1 802.432 C 1338.94 810.346 1331.8 819.807 1325.83 825.409 C 1325.65 824.037 1325.59 823.873 1324.86 822.806 C 1319.27 825.866 1314.57 829.788 1308.64 832.403 C 1297.34 837.392 1268.83 831.475 1257.34 826.939 C 1259.67 826.64 1261.55 826.219 1263.74 825.357 C 1262.04 823.325 1249.21 822.92 1245.38 821.911 L 1239.42 821.77 C 1235.62 821.94 1232.36 821.915 1228.92 823.758 L 1227.95 824.266 A 1186.77 1186.77 0 0 1 1206.1 820.03 C 1187.25 817.664 1160.05 811.807 1141.24 807.435 C 1120.25 804.742 1099.21 800.001 1078.5 795.589 C 1069.47 793.666 1059.91 790.547 1050.76 789.931 L 1050.04 789.644 L 1049.95 779.547 C 1048.82 758.529 1049.14 737.282 1048.88 716.23 L 1047.26 598.667 C 1046.9 578.852 1048.87 557.852 1046.04 538.23 A 74.8537 74.8537 0 0 0 1036.39 511.029 C 1029.17 498.739 1017.67 486.987 1004.76 480.709 C 982.434 469.853 944.311 464.252 919.481 458.743 C 862.981 446.207 805.818 434.827 749.774 420.459 C 751.484 416.276 753.123 412.281 753.425 407.716 C 754.332 393.995 752.485 379.794 752.612 365.982 C 753.119 310.808 751.856 255.539 751.319 200.36 C 755.555 186.813 749.586 172.95 757.182 159.682 C 761.691 151.805 779.091 140.786 780.65 134.521 L 779.46 133.238 L 774.02 133.18 z M 1122.12 799.108 C 1123.58 800.296 1124.39 800.439 1126.25 800.716 C 1131.59 801.516 1138.1 803.509 1142.71 806.39 L 1141.24 807.435 C 1160.05 811.807 1187.25 817.664 1206.1 820.03 A 1186.77 1186.77 0 0 0 1227.95 824.266 L 1228.92 823.758 C 1232.36 821.915 1235.62 821.94 1239.42 821.77 L 1245.38 821.911 C 1244.46 820.994 1243.49 820.255 1242.31 819.724 C 1240.32 818.834 1205.46 814.583 1200.29 813.935 C 1182.99 811.768 1164.61 807.201 1147.57 803.229 C 1141.19 801.743 1134.43 798.937 1127.96 798.202 C 1125.93 797.972 1124.03 798.45 1122.12 799.108 z M 1049.95 779.547 L 1050.04 789.644 L 1050.76 789.931 C 1059.91 790.547 1069.47 793.666 1078.5 795.589 C 1099.21 800.001 1120.25 804.742 1141.24 807.435 L 1142.71 806.39 C 1138.1 803.509 1131.59 801.516 1126.25 800.716 C 1124.39 800.439 1123.58 800.296 1122.12 799.108 C 1121.87 798.981 1121.62 798.841 1121.36 798.725 C 1116.27 796.452 1064.29 785.215 1060.91 786.502 C 1066.96 791.953 1088.62 793.884 1097.49 796.143 L 1096.22 796.878 C 1089.49 796.797 1058.63 790.776 1054.47 786.383 C 1051.98 783.747 1051.18 783.102 1049.95 779.547 z"
    />
    <path
      transform="translate(0,0)"
      fill="rgb(223,74,93)"
      fill-opacity="0.972549"
      d="M 1049.95 779.547 C 1051.18 783.102 1051.98 783.747 1054.47 786.383 C 1058.63 790.776 1089.49 796.797 1096.22 796.878 L 1097.49 796.143 C 1088.62 793.884 1066.96 791.953 1060.91 786.502 C 1064.29 785.215 1116.27 796.452 1121.36 798.725 C 1121.62 798.841 1121.87 798.981 1122.12 799.108 C 1123.58 800.296 1124.39 800.439 1126.25 800.716 C 1131.59 801.516 1138.1 803.509 1142.71 806.39 L 1141.24 807.435 C 1120.25 804.742 1099.21 800.001 1078.5 795.589 C 1069.47 793.666 1059.91 790.547 1050.76 789.931 L 1050.04 789.644 L 1049.95 779.547 z"
    />
    <path
      transform="translate(0,0)"
      fill="rgb(223,74,93)"
      fill-opacity="0.937255"
      d="M 1122.12 799.108 C 1124.03 798.45 1125.93 797.972 1127.96 798.202 C 1134.43 798.937 1141.19 801.743 1147.57 803.229 C 1164.61 807.201 1182.99 811.768 1200.29 813.935 C 1205.46 814.583 1240.32 818.834 1242.31 819.724 C 1243.49 820.255 1244.46 820.994 1245.38 821.911 L 1239.42 821.77 C 1235.62 821.94 1232.36 821.915 1228.92 823.758 L 1227.95 824.266 A 1186.77 1186.77 0 0 1 1206.1 820.03 C 1187.25 817.664 1160.05 811.807 1141.24 807.435 L 1142.71 806.39 C 1138.1 803.509 1131.59 801.516 1126.25 800.716 C 1124.39 800.439 1123.58 800.296 1122.12 799.108 z M 1206.1 820.03 A 1186.77 1186.77 0 0 0 1227.95 824.266 L 1228.92 823.758 C 1232.36 821.915 1235.62 821.94 1239.42 821.77 C 1235.55 821.07 1212.31 816.811 1209.83 817.13 C 1207.63 817.414 1207.32 818.374 1206.1 820.03 z"
    />
    <path
      transform="translate(0,0)"
      fill="rgb(223,74,93)"
      fill-opacity="0.968627"
      d="M 1206.1 820.03 C 1207.32 818.374 1207.63 817.414 1209.83 817.13 C 1212.31 816.811 1235.55 821.07 1239.42 821.77 C 1235.62 821.94 1232.36 821.915 1228.92 823.758 L 1227.95 824.266 A 1186.77 1186.77 0 0 1 1206.1 820.03 z"
    />
    <path
      transform="translate(0,0)"
      fill="url(#Gradient3)"
      d="M 485.758 361.793 C 504.912 366.175 524.524 368.838 543.742 372.925 C 550.387 374.338 556.499 377.495 563.097 378.694 L 572.354 381.095 C 596.874 383.435 620.468 393.398 644.747 396.888 C 668.232 402.712 691.976 407.604 715.626 412.716 C 725.479 414.845 736.395 418.43 746.302 419.303 L 746.056 419.911 L 749.774 420.459 C 805.818 434.827 862.981 446.207 919.481 458.743 C 944.311 464.252 982.434 469.853 1004.76 480.709 C 1017.67 486.987 1029.17 498.739 1036.39 511.029 A 74.8537 74.8537 0 0 1 1046.04 538.23 C 1048.87 557.852 1046.9 578.852 1047.26 598.667 L 1048.88 716.23 C 1049.14 737.282 1048.82 758.529 1049.95 779.547 L 1050.04 789.644 L 1050.76 789.931 L 1050.62 791.351 C 1049.13 806.909 1050.86 823.231 1051 838.878 C 1051.41 885.56 1053.31 932.264 1053.89 978.97 C 1054.12 997.869 1056.41 1021.33 1051.33 1039.52 C 1049.05 1047.67 1042.9 1056.75 1036.46 1062.26 C 1025.82 1071.35 1011.64 1074.22 997.971 1073.07 C 990.606 1072.45 981.992 1071.14 974.895 1068.97 A 7382.17 7382.17 0 0 0 858.099 1046.49 L 853.903 1045.37 C 842.522 1043.48 831.195 1041.05 819.871 1038.84 C 817.849 1038.73 815.694 1038.14 813.696 1037.75 L 779.059 1030.62 C 768.566 1029.64 757.634 1026.91 747.285 1024.83 L 746.845 1024.18 A 6431.09 6431.09 0 0 1 746.068 922.004 C 746.019 872.834 746.508 823.365 744.866 774.228 C 741.014 762.895 738.779 753.028 732.007 742.711 C 724.061 730.607 712.698 720.474 699.433 714.604 C 677.044 704.697 630.708 696.936 604.578 691.099 L 433.944 652.98 L 433.966 652.308 C 432.717 630.304 433.36 607.98 433.556 585.935 L 433.636 511.399 L 433.538 446.458 C 433.526 433.028 432.743 418.931 434.459 405.614 C 435.79 395.277 437.526 387.49 444.288 379.392 C 454.922 366.657 469.91 363.286 485.758 361.793 z M 858.099 1046.49 A 7382.17 7382.17 0 0 1 974.895 1068.97 C 978.031 1068.67 981.113 1068.52 984.263 1068.5 C 982.416 1067.83 980.349 1067.96 978.406 1067.9 L 978.252 1066.16 L 979.33 1066.83 L 978.4 1064.53 C 972.682 1065.19 967.184 1064.36 961.616 1063.11 L 961.909 1062.99 C 948.863 1058.78 936.691 1057.27 923.405 1054.78 C 911.981 1052.65 900.679 1049.58 889.284 1047.23 C 880.631 1045.45 866.107 1041.22 858.099 1046.49 z M 744.866 774.228 C 746.508 823.365 746.019 872.834 746.068 922.004 L 747.484 925.818 C 747.626 925.607 747.796 925.413 747.91 925.186 C 749.237 922.534 750.112 789.059 747.742 779.34 C 747.122 776.8 747.214 775.633 744.866 774.228 z M 779.059 1030.62 L 813.696 1037.75 L 820.199 1036.83 C 818.072 1036.21 815.895 1035.78 813.733 1035.31 C 815.258 1034.9 816.039 1035.01 817.09 1033.78 C 811.008 1030.53 802.067 1029.7 795.163 1028.87 C 789.899 1028.23 783.523 1027.13 779.059 1030.62 z M 819.871 1038.84 C 831.195 1041.05 842.522 1043.48 853.903 1045.37 L 854.261 1044.56 C 852.157 1042.43 847.877 1042.69 844.968 1041.51 C 849.052 1040.24 853.746 1044.03 857.455 1042.4 C 854.75 1039.16 840.513 1037.55 835.818 1036.69 C 829.107 1035.46 825.728 1034.78 819.871 1038.84 z M 563.097 378.694 C 560.598 378.819 558.59 378.66 556.601 380.402 C 557.049 381.413 556.91 381.793 557.996 382.204 C 561.907 383.685 566.335 384.105 570.303 382.469 C 571.108 382.137 571.692 381.644 572.354 381.095 L 563.097 378.694 z"
    />
    <path
      transform="translate(0,0)"
      fill="rgb(248,155,35)"
      fill-opacity="0.941176"
      d="M 563.097 378.694 L 572.354 381.095 C 571.692 381.644 571.108 382.137 570.303 382.469 C 566.335 384.105 561.907 383.685 557.996 382.204 C 556.91 381.793 557.049 381.413 556.601 380.402 C 558.59 378.66 560.598 378.819 563.097 378.694 z"
    />
    <path
      transform="translate(0,0)"
      fill="rgb(249,189,32)"
      fill-opacity="0.964706"
      d="M 819.871 1038.84 C 825.728 1034.78 829.107 1035.46 835.818 1036.69 C 840.513 1037.55 854.75 1039.16 857.455 1042.4 C 853.746 1044.03 849.052 1040.24 844.968 1041.51 C 847.877 1042.69 852.157 1042.43 854.261 1044.56 L 853.903 1045.37 C 842.522 1043.48 831.195 1041.05 819.871 1038.84 z"
    />
    <path
      transform="translate(0,0)"
      fill="rgb(249,189,32)"
      fill-opacity="0.964706"
      d="M 779.059 1030.62 C 783.523 1027.13 789.899 1028.23 795.163 1028.87 C 802.067 1029.7 811.008 1030.53 817.09 1033.78 C 816.039 1035.01 815.258 1034.9 813.733 1035.31 C 815.895 1035.78 818.072 1036.21 820.199 1036.83 L 813.696 1037.75 L 779.059 1030.62 z"
    />
    <path
      transform="translate(0,0)"
      fill="rgb(249,189,32)"
      fill-opacity="0.941176"
      d="M 744.866 774.228 C 747.214 775.633 747.122 776.8 747.742 779.34 C 750.112 789.059 749.237 922.534 747.91 925.186 C 747.796 925.413 747.626 925.607 747.484 925.818 L 746.068 922.004 C 746.019 872.834 746.508 823.365 744.866 774.228 z"
    />
    <path
      transform="translate(0,0)"
      fill="rgb(249,189,32)"
      fill-opacity="0.964706"
      d="M 858.099 1046.49 C 866.107 1041.22 880.631 1045.45 889.284 1047.23 C 900.679 1049.58 911.981 1052.65 923.405 1054.78 C 936.691 1057.27 948.863 1058.78 961.909 1062.99 L 961.616 1063.11 C 967.184 1064.36 972.682 1065.19 978.4 1064.53 L 979.33 1066.83 L 978.252 1066.16 L 978.406 1067.9 C 980.349 1067.96 982.416 1067.83 984.263 1068.5 C 981.113 1068.52 978.031 1068.67 974.895 1068.97 A 7382.17 7382.17 0 0 0 858.099 1046.49 z"
    />
    <path
      transform="translate(0,0)"
      fill="rgb(248,155,35)"
      d="M 746.056 419.911 L 749.774 420.459 C 805.818 434.827 862.981 446.207 919.481 458.743 C 944.311 464.252 982.434 469.853 1004.76 480.709 C 1017.67 486.987 1029.17 498.739 1036.39 511.029 A 74.8537 74.8537 0 0 1 1046.04 538.23 C 1048.87 557.852 1046.9 578.852 1047.26 598.667 L 1048.88 716.23 C 1049.14 737.282 1048.82 758.529 1049.95 779.547 L 1050.04 789.644 C 1045.87 794.721 1049.96 861.423 1048.86 875.548 L 1048.26 875.638 C 1044.2 861.819 1050.56 795.247 1044.42 789.355 C 1042.64 787.641 887.619 758.987 873.194 756.223 C 848.195 751.434 814.122 747.941 791.398 737.703 C 779.832 732.492 768.971 723.007 761.517 712.809 A 73.6363 73.6363 0 0 1 747.624 678.783 C 744.354 653.789 746.472 625.521 746.718 600.201 L 746.766 488.044 A 3880.19 3880.19 0 0 0 746.341 438.492 C 746.264 432.805 745.211 425.443 746.056 419.911 z"
    />
    <path
      transform="translate(0,0)"
      fill="url(#Gradient4)"
      d="M 132.969 616.23 C 143.406 603.829 153.968 597.686 170.224 596.182 C 187.624 594.573 226.354 606.403 245.193 610.485 L 401.797 644.896 C 410.455 646.752 425.763 653.178 433.966 652.308 L 433.944 652.98 L 604.578 691.099 C 630.708 696.936 677.044 704.697 699.433 714.604 C 712.698 720.474 724.061 730.607 732.007 742.711 C 738.779 753.028 741.014 762.895 744.866 774.228 C 746.508 823.365 746.019 872.834 746.068 922.004 A 6431.09 6431.09 0 0 0 746.845 1024.18 L 747.285 1024.83 C 746.751 1082.25 747.847 1139.88 748.172 1197.31 C 748.295 1219.03 750.776 1252.47 747.421 1272.48 C 745.611 1283.27 741.684 1291.3 733.823 1299.03 C 724.158 1308.53 711.303 1313.09 697.845 1312.94 C 687.5 1312.83 676.749 1310.47 666.769 1307.81 C 654.467 1303.56 641.65 1301.32 628.882 1298.94 C 603.721 1295.55 578.053 1288.81 553.183 1283.62 L 418.817 1255.62 A 722.278 722.278 0 0 0 397.859 1251.58 C 390.121 1252.84 348.916 1240.8 337.353 1238.81 L 336.771 1238.33 C 331.04 1237.89 325.296 1236.61 319.663 1235.52 C 312.842 1234.43 306.089 1232.73 299.389 1231.07 C 280.382 1229.14 260.659 1223.36 241.906 1219.39 C 219.537 1214.65 189.207 1212.4 168.972 1202.08 C 147.694 1191.24 133.794 1172.12 126.489 1149.87 C 123.07 1134.34 125.317 1109.56 125.333 1093.01 L 125.412 975.514 L 125.533 748.461 C 125.561 712.123 123.54 673.154 125.772 637.071 C 126.286 628.763 129.204 623.416 132.969 616.23 z M 299.389 1231.07 C 306.089 1232.73 312.842 1234.43 319.663 1235.52 C 325.296 1236.61 331.04 1237.89 336.771 1238.33 L 338.706 1237.7 L 338.531 1236.83 C 335.054 1236.36 330.047 1236.33 327.02 1234.58 C 329.579 1233.49 331.575 1234.11 334.197 1234.64 C 335.796 1234.96 335.007 1235.07 336.502 1234.31 C 334.599 1232.65 332.459 1232.08 330.005 1231.59 C 326.012 1230.79 306.755 1227.15 303.784 1228.18 C 302.523 1228.62 300.562 1230.3 299.389 1231.07 z M 397.859 1251.58 A 722.278 722.278 0 0 1 418.817 1255.62 C 420.895 1255.48 422.657 1253.24 424.123 1253.16 C 426.711 1253 428.532 1255.34 431.631 1254.43 L 430.721 1253.43 C 421.72 1251.15 410.871 1245.44 401.903 1248.81 L 402.881 1248.65 L 402.094 1249.55 C 400.264 1249.87 399.351 1250.54 397.859 1251.58 z"
    />
    <path
      transform="translate(0,0)"
      fill="rgb(56,126,245)"
      fill-opacity="0.968627"
      d="M 397.859 1251.58 C 399.351 1250.54 400.264 1249.87 402.094 1249.55 L 402.881 1248.65 L 401.903 1248.81 C 410.871 1245.44 421.72 1251.15 430.721 1253.43 L 431.631 1254.43 C 428.532 1255.34 426.711 1253 424.123 1253.16 C 422.657 1253.24 420.895 1255.48 418.817 1255.62 A 722.278 722.278 0 0 0 397.859 1251.58 z"
    />
    <path
      transform="translate(0,0)"
      fill="rgb(56,126,245)"
      fill-opacity="0.945098"
      d="M 299.389 1231.07 C 300.562 1230.3 302.523 1228.62 303.784 1228.18 C 306.755 1227.15 326.012 1230.79 330.005 1231.59 C 332.459 1232.08 334.599 1232.65 336.502 1234.31 C 335.007 1235.07 335.796 1234.96 334.197 1234.64 C 331.575 1234.11 329.579 1233.49 327.02 1234.58 C 330.047 1236.33 335.054 1236.36 338.531 1236.83 L 338.706 1237.7 L 336.771 1238.33 C 331.04 1237.89 325.296 1236.61 319.663 1235.52 C 312.842 1234.43 306.089 1232.73 299.389 1231.07 z"
    />
    <path
      transform="translate(0,0)"
      fill="url(#Gradient5)"
      d="M 433.944 652.98 L 604.578 691.099 C 630.708 696.936 677.044 704.697 699.433 714.604 C 712.698 720.474 724.061 730.607 732.007 742.711 C 738.779 753.028 741.014 762.895 744.866 774.228 C 746.508 823.365 746.019 872.834 746.068 922.004 A 6431.09 6431.09 0 0 0 746.845 1024.18 C 738.086 1024.88 717.92 1018.93 708.424 1017.07 L 597.278 995.249 L 534.009 983.14 C 520.662 980.599 506.948 978.524 493.899 974.716 C 482.588 971.415 472.826 966.433 463.701 958.937 C 451.42 948.847 441.543 934.811 437.626 919.282 C 432.133 897.507 434.812 871.123 434.8 848.646 L 434.914 726.122 C 434.964 702.017 436.25 676.984 433.944 652.98 z"
    />
  </svg>
);

// Video models list based on the API documentation
export const VIDEO_MODEL_LIST: VideoModelInfo[] = [
  // Stable Diffusion
  {
    id: "stable_diffusion",
    name: "Stable Video Diffusion",
    alias: "SVD",
    group: "Stability",
    icon: Stability,
    type: ["I2V"],
    description: "modelDescriptions.stable_diffusion",
    supportsDuration: true,
    supportsFps: true,
  },

  // Luma
  {
    id: "luma_video",
    name: "Luma AI",
    alias: "Luma",
    group: "Luma",
    icon: Luma,
    type: ["T2V", "I2V", "I2V_END"],
    description: "modelDescriptions.luma_video",
    supportsDuration: true,
    supportsFps: true,
    supportsEndImage: true,
  },

  // Runway Gen-3
  {
    id: "runway_gen3_t2v",
    name: "Runway Gen-3 T2V",
    alias: "RG3-T2V",
    group: "Runway",
    icon: Runway,
    type: ["T2V"],
    description: "modelDescriptions.runway_gen3_t2v",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "runway_gen3_i2v",
    name: "Runway Gen-3 I2V",
    alias: "RG3-I2V",
    group: "Runway",
    icon: Runway,
    type: ["I2V"],
    description: "modelDescriptions.runway_gen3_i2v",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "runway_gen3_v2v",
    name: "Runway Gen-3 V2V",
    alias: "RG3-V2V",
    group: "Runway",
    icon: Runway,
    type: ["V2V"],
    description: "modelDescriptions.runway_gen3_v2v",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "runway_gen3_i2v_turbo",
    name: "Runway Gen-3 I2V Turbo",
    alias: "RG3-I2V-T",
    group: "Runway",
    icon: Runway,
    type: ["I2V"],
    description: "modelDescriptions.runway_gen3_i2v_turbo",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "runway_gen3_v2v_turbo",
    name: "Runway Gen-3 V2V Turbo",
    alias: "RG3-V2V-T",
    group: "Runway",
    icon: Runway,
    type: ["V2V"],
    description: "modelDescriptions.runway_gen3_v2v_turbo",
    supportsDuration: true,
    supportsFps: true,
  },

  // Kling
  {
    id: "kling_10_t2v",
    name: "Kling 1.0 T2V",
    alias: "K1.0-T2V",
    group: "Kling",
    icon: Kling,
    type: ["T2V"],
    description: "modelDescriptions.kling_10_t2v",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "kling_15_t2v_hq",
    name: "Kling 1.5 T2V HQ",
    alias: "K1.5-T2V-HQ",
    group: "Kling",
    icon: Kling,
    type: ["T2V"],
    description: "modelDescriptions.kling_15_t2v_hq",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "kling_16_t2v",
    name: "Kling 1.6 T2V",
    alias: "K1.6-T2V",
    group: "Kling",
    icon: Kling,
    type: ["T2V"],
    description: "modelDescriptions.kling_16_t2v",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "kling_16_t2v_hq",
    name: "Kling 1.6 T2V HQ",
    alias: "K1.6-T2V-HQ",
    group: "Kling",
    icon: Kling,
    type: ["T2V"],
    description: "modelDescriptions.kling_16_t2v_hq",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "kling_10_i2v",
    name: "Kling 1.0 I2V",
    alias: "K1.0-I2V",
    group: "Kling",
    icon: Kling,
    type: ["I2V"],
    description: "modelDescriptions.kling_10_i2v",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "kling_15_i2v",
    name: "Kling 1.5 I2V",
    alias: "K1.5-I2V",
    group: "Kling",
    icon: Kling,
    type: ["I2V"],
    description: "modelDescriptions.kling_15_i2v",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "kling_15_i2v_hq",
    name: "Kling 1.5 I2V HQ",
    alias: "K1.5-I2V-HQ",
    group: "Kling",
    icon: Kling,
    type: ["I2V"],
    description: "modelDescriptions.kling_15_i2v_hq",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "kling_16_i2v",
    name: "Kling 1.6 I2V",
    alias: "K1.6-I2V",
    group: "Kling",
    icon: Kling,
    type: ["I2V"],
    description: "modelDescriptions.kling_16_i2v",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "kling_16_i2v_hq",
    name: "Kling 1.6 I2V HQ",
    alias: "K1.6-I2V-HQ",
    group: "Kling",
    icon: Kling,
    type: ["I2V"],
    description: "modelDescriptions.kling_16_i2v_hq",
    supportsDuration: true,
    supportsFps: true,
  },

  // Zhipu (Cog)
  {
    id: "cog_t2v",
    name: "Zhipu T2V",
    alias: "Zhipu-T2V",
    group: "Zhipu",
    icon: Zhipu,
    type: ["T2V"],
    description: "modelDescriptions.cog_t2v",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "cog_i2v",
    name: "Zhipu I2V",
    alias: "Zhipu-I2V",
    group: "Zhipu",
    icon: Zhipu,
    type: ["I2V"],
    description: "modelDescriptions.cog_i2v",
    supportsDuration: true,
    supportsFps: true,
  },

  // Minimax
  {
    id: "minimaxi_T2V-01",
    name: "Minimax T2V-01",
    alias: "MM-T2V-01",
    group: "Minimax",
    icon: Minimax,
    type: ["T2V"],
    description: "modelDescriptions.minimaxi_T2V-01",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "minimaxi_T2V-01-Director",
    name: "Minimax T2V-01 Director",
    alias: "MM-T2V-01-D",
    group: "Minimax",
    icon: Minimax,
    type: ["T2V"],
    description: "modelDescriptions.minimaxi_T2V-01-Director",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "minimaxi_I2V-01",
    name: "Minimax I2V-01",
    alias: "MM-I2V-01",
    group: "Minimax",
    icon: Minimax,
    type: ["I2V"],
    description: "modelDescriptions.minimaxi_I2V-01",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "minimaxi_I2V-01-live",
    name: "Minimax I2V-01 Live",
    alias: "MM-I2V-01-L",
    group: "Minimax",
    icon: Minimax,
    type: ["I2V"],
    description: "modelDescriptions.minimaxi_I2V-01-live",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "minimaxi_I2V-01-Director",
    name: "Minimax I2V-01 Director",
    alias: "MM-I2V-01-D",
    group: "Minimax",
    icon: Minimax,
    type: ["I2V"],
    description: "modelDescriptions.minimaxi_I2V-01-Director",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "minimaxi_S2V-01",
    name: "Minimax S2V-01",
    alias: "MM-S2V-01",
    group: "Minimax",
    icon: Minimax,
    type: ["I2V"],
    description: "modelDescriptions.minimaxi_S2V-01",
    supportsDuration: true,
    supportsFps: true,
  },

  // Pika
  // {
  //   id: "pika_1.0",
  //   name: "Pika 1.0",
  //   alias: "Pika-1.0",
  //   group: "Pika",
  //   icon: Pika,
  //   type: ["T2V", "I2V"],
  //   description: "modelDescriptions.pika_1_0",
  //   supportsDuration: true,
  //   supportsFps: true,
  // },
  {
    id: "pika_1.5",
    name: "Pika 1.5",
    alias: "Pika-1.5",
    group: "Pika",
    icon: Pika,
    type: ["T2V", "I2V"],
    description: "modelDescriptions.pika_1_5",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "pika_2.0",
    name: "Pika 2.0",
    alias: "Pika-2.0",
    group: "Pika",
    icon: Pika,
    type: ["T2V", "I2V"],
    description: "modelDescriptions.pika_2_0",
    supportsDuration: true,
    supportsFps: true,
  },
  // {
  //   id: "pika_2.0-contextualize",
  //   name: "Pika 2.0 Contextualize",
  //   alias: "Pika-2.0-C",
  //   group: "Pika",
  //   icon: Pika,
  //   type: ["I2V"],
  //   description: "modelDescriptions.pika_2_0_contextualize",
  //   supportsDuration: true,
  //   supportsFps: true,
  // },

  // Pixverse
  {
    id: "pixverse_v2",
    name: "Pixverse V2",
    alias: "PV-V2",
    group: "Pixverse",
    icon: Pixverse,
    type: ["I2V"],
    description: "modelDescriptions.pixverse_v2",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "pixverse_v3",
    name: "Pixverse V3",
    alias: "PV-V3",
    group: "Pixverse",
    icon: Pixverse,
    type: ["I2V"],
    description: "modelDescriptions.pixverse_v3",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "pixverse_v3.5",
    name: "Pixverse V3.5",
    alias: "PV-V3.5",
    group: "Pixverse",
    icon: Pixverse,
    type: ["I2V"],
    description: "modelDescriptions.pixverse_v3_5",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "pixverse_v4",
    name: "Pixverse V4",
    alias: "PV-V4",
    group: "Pixverse",
    icon: Pixverse,
    type: ["I2V"],
    description: "modelDescriptions.pixverse_v4",
    supportsDuration: true,
    supportsFps: true,
  },

  // Genmo
  {
    id: "genmo_t2v",
    name: "Genmo Mochi1",
    alias: "Genmo",
    group: "Genmo",
    icon: Genmo,
    type: ["T2V"],
    description: "modelDescriptions.genmo_t2v",
    supportsDuration: true,
    supportsFps: true,
  },

  // Haiper
  {
    id: "haiper_20_t2v",
    name: "Haiper 2.0 T2V",
    alias: "Haiper-2.0-T2V",
    group: "Haiper",
    icon: Haiper,
    type: ["T2V"],
    description: "modelDescriptions.haiper_20_t2v",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "haiper_20_i2v",
    name: "Haiper 2.0 I2V",
    alias: "Haiper-2.0-I2V",
    group: "Haiper",
    icon: Haiper,
    type: ["I2V"],
    description: "modelDescriptions.haiper_20_i2v",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "haiper_25_t2v",
    name: "Haiper 2.5 T2V",
    alias: "Haiper-2.5-T2V",
    group: "Haiper",
    icon: Haiper,
    type: ["T2V"],
    description: "modelDescriptions.haiper_25_t2v",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "haiper_25_i2v",
    name: "Haiper 2.5 I2V",
    alias: "Haiper-2.5-I2V",
    group: "Haiper",
    icon: Haiper,
    type: ["I2V"],
    description: "modelDescriptions.haiper_25_i2v",
    supportsDuration: true,
    supportsFps: true,
  },

  // LTX
  {
    id: "ltx_t2v",
    name: "LTX T2V",
    alias: "LTX-T2V",
    group: "LTX",
    icon: LTX,
    type: ["T2V"],
    description: "modelDescriptions.ltx_t2v",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "ltx_i2v",
    name: "LTX I2V",
    alias: "LTX-I2V",
    group: "LTX",
    icon: LTX,
    type: ["I2V"],
    description: "modelDescriptions.ltx_i2v",
    supportsDuration: true,
    supportsFps: true,
  },

  // Wanx
  {
    id: "wanx2.1-t2v-turbo",
    name: "Wanx 2.1 T2V Turbo",
    alias: "Wanx-2.1-T",
    group: "Wanx",
    icon: Wanx,
    type: ["T2V"],
    description: "modelDescriptions.wanx2_1_t2v_turbo",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "wanx2.1-t2v-plus",
    name: "Wanx 2.1 T2V Plus",
    alias: "Wanx-2.1-P",
    group: "Wanx",
    icon: Wanx,
    type: ["T2V"],
    description: "modelDescriptions.wanx2_1_t2v_plus",
    supportsDuration: true,
    supportsFps: true,
  },

  {
    id: "wan_t2v",
    name: "Wan T2V",
    alias: "Wan-T2V",
    group: "Wanx",
    icon: Wanx,
    type: ["T2V"],
    description: "modelDescriptions.wan_t2v",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "wan_i2v",
    name: "Wan I2V",
    alias: "Wan-I2V",
    group: "Wanx",
    icon: Wanx,
    type: ["I2V"],
    description: "modelDescriptions.wan_i2v",
    supportsDuration: true,
    supportsFps: true,
  },

  // Seaweed
  {
    id: "seaweed_t2v",
    name: "Seaweed T2V",
    alias: "Seaweed-T2V",
    group: "Seaweed",
    icon: Seaweed,
    type: ["T2V"],
    description: "modelDescriptions.seaweed_t2v",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "seaweed_i2v",
    name: "Seaweed I2V",
    alias: "Seaweed-I2V",
    group: "Seaweed",
    icon: Seaweed,
    type: ["I2V"],
    description: "modelDescriptions.seaweed_i2v",
    supportsDuration: true,
    supportsFps: true,
  },

  // SiliconFlow
  {
    id: "siliconflow_hunyuan",
    name: "SiliconFlow Hunyuan",
    alias: "SF-HY",
    group: "SiliconFlow",
    icon: SiliconFlow,
    type: ["T2V", "I2V"],
    description: "modelDescriptions.siliconflow_hunyuan",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "siliconflow_wan21_t2v_14b",
    name: "SiliconFlow Wan21 T2V 14B",
    alias: "SF-Wan21-T2V",
    group: "SiliconFlow",
    icon: SiliconFlow,
    type: ["T2V"],
    description: "modelDescriptions.siliconflow_wan21_t2v_14b",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "siliconflow_wan21_t2v_14b_turbo",
    name: "SiliconFlow Wan21 T2V 14B Turbo",
    alias: "SF-Wan21-T2V-T",
    group: "SiliconFlow",
    icon: SiliconFlow,
    type: ["T2V"],
    description: "modelDescriptions.siliconflow_wan21_t2v_14b_turbo",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "siliconflow_wan21_i2v_14b_720p",
    name: "SiliconFlow Wan21 I2V 14B 720p",
    alias: "SF-Wan21-I2V",
    group: "SiliconFlow",
    icon: SiliconFlow,
    type: ["I2V"],
    description: "modelDescriptions.siliconflow_wan21_i2v_14b_720p",
    supportsDuration: true,
    supportsFps: true,
  },
  {
    id: "siliconflow_wan21_i2v_14b_720p_turbo",
    name: "SiliconFlow Wan21 I2V 14B 720p Turbo",
    alias: "SF-Wan21-I2V-T",
    group: "SiliconFlow",
    icon: SiliconFlow,
    type: ["I2V"],
    description: "modelDescriptions.siliconflow_wan21_i2v_14b_720p_turbo",
    supportsDuration: true,
    supportsFps: true,
  },

  // Google
  {
    id: "google_veo_t2v",
    name: "Google VEO T2V",
    alias: "G-VEO",
    group: "Google",
    icon: Google,
    type: ["T2V"],
    description: "modelDescriptions.google_veo_t2v",
    supportsDuration: true,
    supportsFps: true,
  },

  // Skyreels
  {
    id: "skyreels_i2v",
    name: "Skyreels I2V",
    alias: "SR-I2V",
    group: "Skyreels",
    icon: Skyreels,
    type: ["I2V"],
    description: "modelDescriptions.skyreels_i2v",
    supportsDuration: true,
    supportsFps: true,
  },
];

// Helper function to get model by ID
export const getVideoModelById = (id: string): VideoModelInfo | undefined => {
  return VIDEO_MODEL_LIST.find((model) => model.id === id);
};

// Helper function to get model by alias
export const getVideoModelByAlias = (
  alias: string
): VideoModelInfo | undefined => {
  return VIDEO_MODEL_LIST.find((model) => model.alias === alias);
};

// Helper function to get random model
export const getRandomVideoModel = (
  modelType?: ModelType,
  excludeModel?: string
): string => {
  let availableModels = VIDEO_MODEL_LIST;

  if (modelType) {
    availableModels = availableModels.filter((model) =>
      model.type.includes(modelType)
    );
  }

  if (excludeModel) {
    availableModels = availableModels.filter(
      (model) => model.id !== excludeModel
    );
  }

  return availableModels[Math.floor(Math.random() * availableModels.length)].id;
};

// Helper function to get models by type
export const getVideoModelsByType = (type: ModelType): VideoModelInfo[] => {
  return VIDEO_MODEL_LIST.filter((model) => model.type.includes(type));
};
