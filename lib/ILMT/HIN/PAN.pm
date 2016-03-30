package ILMT::HIN::PAN;
use strict;
use warnings;
use Data::Dumper;
use ILMT::Translator;

my @seq = ("Tokenizer", "UTF2WX", "Morph", "POSTagger");

my $langpair_obj = new_translator ILMT::Translator("HIN", "PAN", \@seq);
