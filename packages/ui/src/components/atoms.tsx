import { FC } from "react";

export const Logo: FC<JSX.IntrinsicElements["svg"]> = (props) => (
  <svg
    width="46"
    height="74"
    viewBox="0 0 46 74"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M45.2652 70.3061C44.4578 68.7376 43.1738 67.4657 41.5977 66.6733C37.9823 64.5188 33.6104 64.1787 29.4915 64.3394C29.0443 64.3568 28.597 64.3809 28.1525 64.4063C27.424 64.2229 26.6541 64.0582 25.8507 63.9176C24.9134 63.7529 23.9318 63.6136 22.9275 63.4757C20.919 63.1998 18.8141 62.9401 16.7479 62.5812C14.7973 62.2635 12.878 61.7769 11.0116 61.127L10.8589 61.0748C9.21138 60.4856 7.64452 59.6916 6.1951 58.7114C5.85499 58.4811 5.52562 58.2321 5.20693 57.9763C7.68111 59.8049 10.7345 60.6741 13.8008 60.4227C15.9714 60.0678 18.118 59.5786 20.2281 58.9578C21.4011 58.7088 23.2516 58.2562 24.2586 59.1024C25.0914 59.8027 24.6268 60.8191 23.7149 61.1431C23.3889 61.2688 23.0352 61.3049 22.6905 61.2476C22.4999 61.2635 22.3093 61.2157 22.1487 61.1118C21.988 61.0078 21.8664 60.8536 21.8028 60.6731C22.034 60.4419 22.2647 60.2098 22.495 59.9768C22.5636 60.0011 22.6387 59.9987 22.7056 59.9701C22.7724 59.9415 22.826 59.8888 22.8557 59.8224C22.8854 59.7561 22.8891 59.681 22.8659 59.6121C22.8428 59.5432 22.7945 59.4855 22.7307 59.4506C22.5476 59.3574 22.3427 59.3154 22.1377 59.3291C21.9327 59.3429 21.7353 59.4117 21.5662 59.5285C21.3972 59.6453 21.2627 59.8056 21.1773 59.9925C21.0919 60.1794 21.0587 60.3858 21.0811 60.5901C21.1708 61.68 22.3478 62.1206 23.2878 62.0081C24.3309 61.8742 25.5213 61.2529 25.5105 60.0572C25.4642 59.529 25.235 59.0336 24.8624 58.6564C24.4899 58.2792 23.9974 58.0439 23.4699 57.9911C21.9074 57.8571 20.3346 58.0636 18.8596 58.5963C17.0792 59.1966 15.2431 59.6173 13.379 59.8523C10.7656 60.0083 8.17053 59.3278 5.9701 57.9094C5.71606 57.6125 5.48169 57.2994 5.26847 56.972C3.91293 54.9099 3.20378 52.4901 3.23181 50.0225C3.21037 47.923 3.43829 45.8284 3.91073 43.7826C5.09745 45.0939 6.56238 46.1232 8.19833 46.7951C9.83427 47.4669 11.5998 47.7645 13.3656 47.6658C16.1108 47.7203 18.8341 47.1675 21.3408 46.0469C23.5306 45.0545 25.4118 43.4889 26.7853 41.5156C28.1075 39.5703 29.0946 37.4173 29.7057 35.1459C30.3434 32.7924 30.6641 30.3643 30.6592 27.9259C30.437 23.3107 29.9339 18.7133 29.1527 14.1593C30.8369 12.6299 32.3406 10.9128 33.6344 9.04158C34.6559 7.58076 35.2041 5.84154 35.2051 4.05905C35.1768 3.01048 34.8178 1.99767 34.1794 1.16539C33.8636 0.777284 33.4615 0.468308 33.0051 0.263037C32.5488 0.0577666 32.0508 -0.0381216 31.5509 -0.0169618C27.4548 -0.0169618 25.3767 3.80595 25.3767 11.346C25.378 12.4299 25.4375 13.513 25.5548 14.5905L19.5037 19.6721C17.9035 18.3624 15.8774 17.6871 13.8115 17.7747C12.0965 17.7706 10.404 18.1653 8.86776 18.9276C7.35853 19.665 6.01962 20.7088 4.93641 21.9926C3.72632 23.5066 2.74054 25.1869 2.00933 26.9818C1.08734 29.2161 0.63167 31.6152 0.670303 34.0318C0.615065 36.5405 1.16289 39.0257 2.26775 41.2786C1.41126 43.9336 0.988512 46.7094 1.01577 49.4989C0.996175 52.4981 1.89981 55.4307 3.60408 57.8987C4.04693 58.5526 4.56211 59.1545 5.13991 59.693C7.85843 62.9533 11.6621 65.1233 15.8521 65.8043C18.3427 66.1189 20.8789 65.831 23.3507 66.2716C24.733 66.4649 26.043 67.0084 27.1562 67.8503C27.3678 68.0244 27.8257 68.3497 27.8673 68.6644C27.8659 68.9582 27.7633 69.2425 27.5767 69.4694C27.3901 69.6963 27.1309 69.8518 26.8429 69.9097C26.6128 69.9503 26.3758 69.9168 26.1659 69.8141C25.9561 69.7113 25.7842 69.5446 25.6752 69.338C25.5293 68.8894 26.148 68.3444 26.5764 68.6015C26.8001 68.7354 26.9968 68.3752 26.8121 68.2199C25.4222 67.0442 23.9345 70.1347 26.2845 70.5739C26.7852 70.6817 27.3083 70.5874 27.7398 70.3116C28.1714 70.0357 28.4766 69.6006 28.589 69.101C28.7149 67.8851 27.2325 67.0228 26.3447 66.5729C22.8151 64.7879 18.7123 65.8364 14.963 65.1348C11.8579 64.4397 8.98832 62.9456 6.63831 60.8003C6.67446 60.8204 6.71196 60.8392 6.74946 60.8592C8.38919 62.0833 10.1833 63.0855 12.0855 63.8399C16.4011 65.5806 20.8347 65.4722 25.3124 65.2405L25.5802 65.2928C26.4827 65.4749 27.3357 65.6837 28.115 65.9127C29.4011 66.272 30.6372 66.7907 31.7946 67.4566C32.0196 67.5771 32.203 67.715 32.3771 67.8275C32.5311 67.9267 32.6796 68.0345 32.8217 68.1503L33.1376 68.3953L33.3184 68.5573C33.9638 69.121 34.5236 69.654 34.9414 70.0664C34.9976 70.1173 35.0512 70.1641 35.102 70.207C35.1259 70.228 35.1509 70.2477 35.177 70.2659L35.2185 70.2793H35.2292L35.264 70.2713L35.3002 70.2632C35.2774 70.3249 35.2727 70.3918 35.2868 70.456C35.2992 70.5064 35.3246 70.5525 35.3605 70.59C35.3979 70.6288 35.4445 70.6577 35.4959 70.6741C35.5473 70.6904 35.602 70.6937 35.655 70.6837C35.7151 70.6733 35.7722 70.6499 35.8224 70.6154C35.8555 70.595 35.8857 70.5702 35.9121 70.5417C35.9706 70.4803 36.0129 70.4053 36.0353 70.3235C36.0685 70.197 36.0717 70.0645 36.0447 69.9365C36.0344 69.8828 36.0201 69.83 36.0019 69.7785L35.967 69.6674C35.9429 69.5951 35.9161 69.5201 35.8853 69.4411C35.5609 68.6255 35.038 67.9039 34.3642 67.3415L34.1486 67.1513C34.0495 67.0723 33.921 66.9799 33.7737 66.8688C33.6065 66.7385 33.4326 66.6169 33.2528 66.5046C33.0506 66.3787 32.8337 66.2261 32.5833 66.0935C31.8273 65.6782 31.0414 65.3202 30.232 65.0223C30.5855 65.0156 30.9376 65.0116 31.2912 65.0116C34.6539 64.8906 37.9916 65.6318 40.987 67.1647C42.235 67.8717 44.8006 69.4933 44.6586 71.1671C44.5735 71.6558 44.3488 72.1095 44.0117 72.4735C43.6745 72.8375 43.2393 73.0962 42.7585 73.2184C42.4821 73.2893 42.191 73.2772 41.9215 73.1836C41.6519 73.09 41.4159 72.9191 41.2428 72.6922C40.75 71.9933 41.6538 70.8457 42.4305 71.3947C42.4955 71.4444 42.5773 71.4671 42.6586 71.4577C42.7399 71.4484 42.8144 71.4079 42.8664 71.3447C42.9185 71.2816 42.9441 71.2007 42.9377 71.1191C42.9313 71.0375 42.8935 70.9616 42.8323 70.9073C42.596 70.7255 42.3124 70.6156 42.0153 70.5908C41.7182 70.566 41.4203 70.6273 41.1572 70.7675C40.8942 70.9076 40.6771 71.1207 40.5319 71.381C40.3868 71.6414 40.3198 71.9381 40.339 72.2356C40.3986 72.575 40.5385 72.8951 40.7472 73.1693C40.9559 73.4434 41.2272 73.6636 41.5385 73.8114C41.8498 73.9591 42.1919 74.0302 42.5362 74.0186C42.8806 74.007 43.2172 73.9131 43.5178 73.7447C44.1593 73.459 44.6831 72.9613 45.0012 72.3353C45.3194 71.7092 45.4126 70.9927 45.2652 70.3061ZM31.5469 2.11879C32.1856 2.11879 33.0319 2.3451 33.0319 4.2974C33.0319 6.25372 31.6219 8.68942 28.838 11.5415C28.7322 10.4583 28.6787 9.55307 28.6787 8.84339C28.6841 4.37505 29.6495 2.11879 31.5469 2.11879ZM19.2439 25.0041C19.2296 27.238 18.3437 29.3779 16.7748 30.9681C16.3412 31.5188 15.7935 31.9692 15.1695 32.2881C14.5454 32.6071 13.8596 32.7872 13.1594 32.816H12.6907L12.7724 33.2766C12.819 33.6593 12.9919 34.0155 13.2638 34.2889C13.5503 34.5328 13.9192 34.6579 14.2949 34.6384C15.8949 34.66 17.4541 34.1336 18.7137 33.1467C19.8915 32.2663 20.806 31.0804 21.3582 29.7175C21.8715 28.3282 22.1234 26.8559 22.1014 25.375C22.1119 23.8974 21.677 22.4509 20.8535 21.224L25.7891 17.1239C26.3314 22.8389 26.6073 26.3163 26.6073 27.4679C26.737 31.835 25.6795 36.1555 23.5475 39.9691C22.5293 41.6838 21.0694 43.0938 19.3202 44.0518C17.3818 45.0874 15.2093 45.6062 13.0121 45.5582C11.3611 45.6773 9.70846 45.3497 8.22783 44.6096C6.74721 43.8695 5.49326 42.7444 4.59765 41.3523C5.8075 37.8484 7.65775 34.5997 10.0542 31.7716C12.7698 28.5845 15.7339 25.6177 18.9186 22.8992C19.1365 23.5778 19.248 24.286 19.2493 24.9988L19.2439 25.0041ZM3.50634 29.2689C4.32644 25.9542 6.36434 23.0696 9.21461 21.1892C10.6635 20.3312 12.3206 19.8888 14.0043 19.9105C15.3753 19.8375 16.7226 20.2906 17.771 21.1772C10.5952 27.3086 5.74114 33.1373 3.32286 38.5256C2.92285 37.1328 2.72444 35.6898 2.73368 34.2407C2.73357 32.5514 2.99601 30.8723 3.51165 29.2636L3.50634 29.2689ZM15.8535 64.3675C13.594 63.9198 11.423 63.1056 9.4262 61.9573C9.24945 61.8555 9.08072 61.7457 8.91067 61.6386C7.75007 60.8682 6.65256 60.0067 5.62864 59.0623C5.69292 59.1131 5.75452 59.1694 5.82013 59.2189C7.15819 60.2449 8.6193 61.0995 10.1694 61.7631C10.2872 61.814 10.405 61.8662 10.5241 61.9144C12.4632 62.6953 14.4711 63.2929 16.5216 63.6993C18.5409 64.1265 20.583 64.4398 22.5098 64.7598C20.2849 64.8873 18.0527 64.7539 15.8588 64.3621L15.8535 64.3675Z"
      fill="#C8A851"
    />
  </svg>
);
