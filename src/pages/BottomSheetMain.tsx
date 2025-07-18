import { useState } from 'react';
import BottomSheet from '@/components/common/BottomSheet';

const BottomSheetMain = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={handleOpen}
        className="w-full bg-primary text-white py-2 rounded-lg text-m font-semibold"
      >
        바텀시트 열기
      </button>

      <BottomSheet isOpen={isOpen} onClose={handleClose}>
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dapibus metus vel velit
          vulputate, nec interdum nulla cursus. Etiam quis tellus vel ex feugiat luctus. Proin
          posuere, metus sed bibendum tempor, sem orci tincidunt eros, nec rutrum purus sapien vitae
          ex. Aenean sed sodales lacus. Vestibulum aliquam, massa ut tincidunt suscipit, arcu libero
          vehicula orci, non accumsan nulla libero sed mi. Sed sit amet lacus eu ex convallis
          hendrerit sed in nisl. Nam porttitor elit at elit faucibus, a euismod velit commodo. Duis
          imperdiet, elit sed fermentum rutrum, orci elit consequat diam, vel tristique leo mi ac
          justo. Nullam ut dolor risus. Etiam non velit vitae purus cursus convallis. Morbi ac odio
          at odio bibendum imperdiet at id sem. Integer sed tristique magna, nec posuere justo.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dapibus metus vel velit
          vulputate, nec interdum nulla cursus. Etiam quis tellus vel ex feugiat luctus. Proin
          posuere, metus sed bibendum tempor, sem orci tincidunt eros, nec rutrum purus sapien vitae
          ex. Aenean sed sodales lacus. Vestibulum aliquam, massa ut tincidunt suscipit, arcu libero
          vehicula orci, non accumsan nulla libero sed mi. Sed sit amet lacus eu ex convallis
          hendrerit sed in nisl. Nam porttitor elit at elit faucibus, a euismod velit commodo. Duis
          imperdiet, elit sed fermentum rutrum, orci elit consequat diam, vel tristique leo mi ac
          justo. Nullam ut dolor risus. Etiam non velit vitae purus cursus convallis. Morbi ac odio
          at odio bibendum imperdiet at id sem. Integer sed tristique magna, nec posuere justo.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dapibus metus vel velit
          vulputate, nec interdum nulla cursus. Etiam quis tellus vel ex feugiat luctus. Proin
          posuere, metus sed bibendum tempor, sem orci tincidunt eros, nec rutrum purus sapien vitae
          ex. Aenean sed sodales lacus. Vestibulum aliquam, massa ut tincidunt suscipit, arcu libero
          vehicula orci, non accumsan nulla libero sed mi. Sed sit amet lacus eu ex convallis
          hendrerit sed in nisl. Nam porttitor elit at elit faucibus, a euismod velit commodo. Duis
          imperdiet, elit sed fermentum rutrum, orci elit consequat diam, vel tristique leo mi ac
          justo. Nullam ut dolor risus. Etiam non velit vitae purus cursus convallis. Morbi ac odio
          at odio bibendum imperdiet at id sem. Integer sed tristique magna, nec posuere justo.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dapibus metus vel velit
          vulputate, nec interdum nulla cursus. Etiam quis tellus vel ex feugiat luctus. Proin
          posuere, metus sed bibendum tempor, sem orci tincidunt eros, nec rutrum purus sapien vitae
          ex. Aenean sed sodales lacus. Vestibulum aliquam, massa ut tincidunt suscipit, arcu libero
          vehicula orci, non accumsan nulla libero sed mi. Sed sit amet lacus eu ex convallis
          hendrerit sed in nisl. Nam porttitor elit at elit faucibus, a euismod velit commodo. Duis
          imperdiet, elit sed fermentum rutrum, orci elit consequat diam, vel tristique leo mi ac
          justo. Nullam ut dolor risus. Etiam non velit vitae purus cursus convallis. Morbi ac odio
          at odio bibendum imperdiet at id sem. Integer sed tristique magna, nec posuere justo.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dapibus metus vel velit
          vulputate, nec interdum nulla cursus. Etiam quis tellus vel ex feugiat luctus. Proin
          posuere, metus sed bibendum tempor, sem orci tincidunt eros, nec rutrum purus sapien vitae
          ex. Aenean sed sodales lacus. Vestibulum aliquam, massa ut tincidunt suscipit, arcu libero
          vehicula orci, non accumsan nulla libero sed mi. Sed sit amet lacus eu ex convallis
          hendrerit sed in nisl. Nam porttitor elit at elit faucibus, a euismod velit commodo. Duis
          imperdiet, elit sed fermentum rutrum, orci elit consequat diam, vel tristique leo mi ac
          justo. Nullam ut dolor risus. Etiam non velit vitae purus cursus convallis. Morbi ac odio
          at odio bibendum imperdiet at id sem. Integer sed tristique magna, nec posuere justo.
        </div>
      </BottomSheet>
    </>
  );
};

export default BottomSheetMain;
