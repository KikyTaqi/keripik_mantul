import React from "react";
import '../style.css';
import Gambar from "../assets/produk_about.png";
import { ImSpoonKnife } from "react-icons/im";
import { PiPlantFill } from "react-icons/pi";
import { RiShoppingBasket2Fill } from "react-icons/ri";
import { FaCartArrowDown } from "react-icons/fa";


const About = () => {

    return (
        <div className="bg-white">
            <div className="flex flex-row justify-between px-10 py-5">
                <div 
                    className="mt-8 ms-8" 
                    style={{ maxWidth: '60vw', marginRight: '5vw' }}
                >
                    <h1 className="text-3xl font-bold calistoga-regular">ABOUT US</h1>
                    <p className="mt-8 text-base font-medium pe-4">
                        Keripik Mantul adalah camilan renyah dengan berbagai pilihan rasa yang 
                        menggoda, mulai dari keripik singkong, talas, hingga pisang. Setiap gigitan 
                        memberikan kenikmatan yang sulit dilupakan. Setiap hari, semakin banyak
                        orang yang memilih Keripik Mantul sebagai teman santai atau pelengkap 
                        momen spesial. Dengan kualitas terbaik dan mudah didapat, Keripik Mantul 
                        hadir untuk menemani hari Anda kapan saja dan di mana saja.
                    </p>

                    <p className="mt-8 text-base font-medium pe-4">
                        Berasal dari singkong pilihan hasil panen petani lokal, setiap keripik kami 
                        diolah secara higienis dengan standar tinggi. Kami percaya, camilan sederhana 
                        bisa menjadi istimewa ketika dibuat dengan cinta dan dedikasi.
                    </p>
                </div>
                <div className="ms-4">
                    <img 
                    src={Gambar} 
                    style={{ height: '60vh', width: '100vw', objectFit: 'contain', marginRight: '15vw' }} 
                    alt="gambar produk" 
                    />
                </div>
            </div>
            <div className="bg-[#F2E8C6] grid grid-cols-2 gap-2 p-4" style={{ marginLeft: '5vw', marginRight: '5vw' }}>
                <div className="p-4 bg-white me-4 text-center">
                    <h1 className="text-2xl font-semibold mb-4 calistoga-regular">VISI</h1>
                    <p style={{ marginLeft: '4vw', marginRight: '4vw' }} className="text-base">
                        Menjadi merek camilan keripik terdepan di Indonesia, dikenal karena kualitas unggul, 
                        inovasi rasa yang kreatif, dan dukungannya terhadap produk lokal, serta memberikan 
                        dampak positif yang berkelanjutan bagi perekonomian dan lingkungan.</p>
                </div>
                <div className="p-4 bg-white text-center">
                    <h1 className="text-2xl font-semibold mb-4 calistoga-regular">MISI</h1>
                    <p style={{ marginLeft: '4vw', marginRight: '4vw' }} className="text-base">
                        Kami berkomitmen menyediakan camilan sehat, lezat, dan terjangkau dengan varian rasa 
                        inovatif. Kami mendukung petani lokal, menjaga proses produksi yang bersih dan ramah 
                        lingkungan, serta membangun hubungan erat dengan konsumen melalui produk berkualitas 
                        dan pelayanan terbaik.
                    </p>
                </div>
            </div>
            <div className="p-4 mt-12 text-center">
                <h1 className="mb-8 calistoga-regular text-3xl font-semibold">Kenapa harus Keripik Mantul?</h1>
                <div className="grid grid-cols-4 gap-4 divide-x-2 divide-red-800">
                    <div className="text-center">
                        <ImSpoonKnife className="text-7xl mb-8 text-red-800 mx-auto" />
                        <h1 className="text-lg font-semibold text-red-800 mb-3">Kombinasi Rasa yang Unik</h1>
                        <p className="text-base font-medium" style={{ paddingLeft: '4vw', paddingRight: '4vw'}}>
                            Menghadirkan rasa yang unik dan inovatif, cocok untuk semua !
                        </p>
                    </div>
                    <div className="text-center">
                        <PiPlantFill className="text-7xl mb-8 text-red-800 mx-auto" />
                        <h1 className="text-lg font-semibold text-red-800 mb-3">Tanpa Pengawet</h1>
                        <p className="text-base font-medium" style={{ paddingLeft: '4vw', paddingRight: '4vw'}}>
                            Dibuat dengan bahan alami, sehat dinikmati.
                        </p>
                    </div>
                    <div className="text-center">
                        <RiShoppingBasket2Fill className="text-7xl mb-8 text-red-800 mx-auto" />
                        <h1 className="text-lg font-semibold text-red-800 mb-3">Bahan Pilihan</h1>
                        <p className="text-base font-medium" style={{ paddingLeft: '4vw', paddingRight: '4vw'}}>
                            Bahan segar dari petani lokal, menghasilkan rasa natural dan berkualitas.
                        </p>
                    </div>
                    <div className="text-center">
                        <FaCartArrowDown className="text-7xl mb-8 text-red-800 mx-auto" />
                        <h1 className="text-lg font-semibold text-red-800 mb-3">Mudah Dibeli</h1>
                        <p className="text-base font-medium" style={{ paddingLeft: '4vw', paddingRight: '4vw'}}>
                            Pesan kapan saja dengan cepat melalui website kami.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;